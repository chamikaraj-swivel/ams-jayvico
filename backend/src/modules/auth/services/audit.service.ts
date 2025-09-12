import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../../../common/firestore/firestore.service';

export enum AuditEventType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DEACTIVATE = 'USER_DEACTIVATE',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  LOGIN_FAILED = 'LOGIN_FAILED',
}

export interface AuditEvent {
  id?: string;
  userId: string;
  eventType: AuditEventType;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

@Injectable()
export class AuditService {
  constructor(private firestoreService: FirestoreService) {}

  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      const auditCollection = this.firestoreService.getAuditLogsCollection();
      
      const auditEvent: AuditEvent = {
        ...event,
        id: '', // Will be set by Firestore
        timestamp: new Date().toISOString(),
      };

      await auditCollection.add(auditEvent);
    } catch (error) {
      // Log error but don't throw to avoid breaking the main flow
      console.error('Failed to log audit event:', error);
    }
  }

  async getAuditLogs(userId?: string, eventType?: AuditEventType, limit: number = 100): Promise<AuditEvent[]> {
    try {
      const auditCollection = this.firestoreService.getAuditLogsCollection();
      let query = auditCollection.orderBy('timestamp', 'desc').limit(limit);

      if (userId) {
        query = query.where('userId', '==', userId);
      }

      if (eventType) {
        query = query.where('eventType', '==', eventType);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as AuditEvent));
    } catch (error) {
      console.error('Failed to get audit logs:', error);
      return [];
    }
  }

  async logLogin(userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logEvent({
      userId,
      eventType: AuditEventType.LOGIN,
      description: 'User logged in successfully',
      ipAddress,
      userAgent,
    });
  }

  async logLogout(userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logEvent({
      userId,
      eventType: AuditEventType.LOGOUT,
      description: 'User logged out',
      ipAddress,
      userAgent,
    });
  }

  async logLoginFailed(email: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logEvent({
      userId: 'anonymous', // No user ID for failed logins
      eventType: AuditEventType.LOGIN_FAILED,
      description: `Failed login attempt for email: ${email}`,
      metadata: { email },
      ipAddress,
      userAgent,
    });
  }

  async logRegister(userId: string, email: string, role: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logEvent({
      userId,
      eventType: AuditEventType.REGISTER,
      description: 'New user registered',
      metadata: { email, role },
      ipAddress,
      userAgent,
    });
  }

  async logProfileUpdate(userId: string, changes: Record<string, any>, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logEvent({
      userId,
      eventType: AuditEventType.PROFILE_UPDATE,
      description: 'User profile updated',
      metadata: { changes },
      ipAddress,
      userAgent,
    });
  }

  async logUserCreate(adminUserId: string, newUserId: string, newUserEmail: string, role: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logEvent({
      userId: adminUserId,
      eventType: AuditEventType.USER_CREATE,
      description: 'Admin created new user',
      metadata: { newUserId, newUserEmail, role },
      ipAddress,
      userAgent,
    });
  }

  async logUserUpdate(adminUserId: string, targetUserId: string, changes: Record<string, any>, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logEvent({
      userId: adminUserId,
      eventType: AuditEventType.USER_UPDATE,
      description: 'Admin updated user',
      metadata: { targetUserId, changes },
      ipAddress,
      userAgent,
    });
  }

  async logUserDeactivate(adminUserId: string, targetUserId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logEvent({
      userId: adminUserId,
      eventType: AuditEventType.USER_DEACTIVATE,
      description: 'Admin deactivated user',
      metadata: { targetUserId },
      ipAddress,
      userAgent,
    });
  }

  async logTokenRefresh(userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logEvent({
      userId,
      eventType: AuditEventType.TOKEN_REFRESH,
      description: 'User refreshed access token',
      ipAddress,
      userAgent,
    });
  }
}
