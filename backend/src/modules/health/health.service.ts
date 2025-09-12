import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../../common/firestore/firestore.service';

@Injectable()
export class HealthService {
  constructor(private readonly firestoreService: FirestoreService) {}

  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'vehicle-import-backend',
      version: '1.0.0',
    };
  }

  ready() {
    try {
      // Check if Firestore is accessible
      const firestore = this.firestoreService.getFirestore();
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
        database: 'connected',
      };
    } catch (error) {
      return {
        status: 'not ready',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
      };
    }
  }

  live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

