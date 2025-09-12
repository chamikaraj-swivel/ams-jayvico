import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { FirestoreService } from '../../common/firestore/firestore.service';
import { AuditService } from './services/audit.service';
import { LoginDto, RegisterDto, UpdateProfileDto, CreateUserDto, UpdateUserDto, AuthResponseDto, UserRole } from './dto/auth.dto';
import { User, JwtPayload } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private firestoreService: FirestoreService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const usersCollection = this.firestoreService.getUsersCollection();
    const userQuery = await usersCollection.where('email', '==', email).limit(1).get();
    
    if (userQuery.empty) {
      return null;
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data() as User;
    
    if (!userData.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await userDoc.ref.update({
      lastLoginAt: new Date().toISOString(),
    });

    return {
      ...userData,
      id: userDoc.id,
    };
  }

  async validateUserById(userId: string): Promise<User | null> {
    const usersCollection = this.firestoreService.getUsersCollection();
    const userDoc = await usersCollection.doc(userId).get();
    
    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data() as User;
    return {
      ...userData,
      id: userDoc.id,
    };
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      // Log failed login attempt
      await this.auditService.logLoginFailed(loginDto.email, ipAddress, userAgent);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Log successful login
    await this.auditService.logLogin(user.id, ipAddress, userAgent);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const usersCollection = this.firestoreService.getUsersCollection();
    
    // Check if user already exists
    const existingUserQuery = await usersCollection.where('email', '==', registerDto.email).limit(1).get();
    if (!existingUserQuery.empty) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user document
    const userData = {
      email: registerDto.email,
      passwordHash,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userRef = await usersCollection.add(userData);
    const userId = userRef.id;

    // Log registration
    await this.auditService.logRegister(userId, registerDto.email, registerDto.role, ipAddress, userAgent);

    // Generate tokens
    const payload: JwtPayload = {
      sub: userId,
      email: registerDto.email,
      role: registerDto.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: registerDto.role,
        isActive: true,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken) as JwtPayload;
      const user = await this.validateUserById(payload.sub);
      
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '24h' });
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const usersCollection = this.firestoreService.getUsersCollection();
    const userRef = usersCollection.doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new NotFoundException('User not found');
    }

    const updateData = {
      ...updateProfileDto,
      updatedAt: new Date().toISOString(),
    };

    await userRef.update(updateData);

    const updatedUser = await this.validateUserById(userId);
    return updatedUser!;
  }

  async getAllUsers(): Promise<User[]> {
    const usersCollection = this.firestoreService.getUsersCollection();
    const usersQuery = await usersCollection.get();
    
    return usersQuery.docs.map(doc => ({
      ...doc.data() as User,
      id: doc.id,
    }));
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const usersCollection = this.firestoreService.getUsersCollection();
    
    // Check if user already exists
    const existingUserQuery = await usersCollection.where('email', '==', createUserDto.email).limit(1).get();
    if (!existingUserQuery.empty) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    // Create user document
    const userData = {
      email: createUserDto.email,
      passwordHash,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role,
      isActive: createUserDto.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userRef = await usersCollection.add(userData);
    const userId = userRef.id;

    return {
      ...userData,
      id: userId,
    };
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const usersCollection = this.firestoreService.getUsersCollection();
    const userRef = usersCollection.doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new NotFoundException('User not found');
    }

    const updateData = {
      ...updateUserDto,
      updatedAt: new Date().toISOString(),
    };

    await userRef.update(updateData);

    const updatedUser = await this.validateUserById(userId);
    return updatedUser!;
  }

  async deactivateUser(userId: string): Promise<void> {
    const usersCollection = this.firestoreService.getUsersCollection();
    const userRef = usersCollection.doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new NotFoundException('User not found');
    }

    await userRef.update({
      isActive: false,
      updatedAt: new Date().toISOString(),
    });
  }
}
