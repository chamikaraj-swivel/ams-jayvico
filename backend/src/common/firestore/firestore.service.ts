import { Injectable, OnModuleInit } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class FirestoreService implements OnModuleInit {
  private firestore: Firestore;

  async onModuleInit() {
    try {
      // Initialize Firestore
      this.firestore = new Firestore({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });

      console.log('✅ Firestore connection initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Firestore:', error);
      throw error;
    }
  }

  getFirestore(): Firestore {
    return this.firestore;
  }

  // Collection references
  getVehiclesCollection() {
    return this.firestore.collection('vehicles');
  }

  getCustomersCollection() {
    return this.firestore.collection('customers');
  }

  getOrdersCollection() {
    return this.firestore.collection('orders');
  }

  getUsersCollection() {
    return this.firestore.collection('users');
  }

  getAuditLogsCollection() {
    return this.firestore.collection('audit_logs');
  }
}

