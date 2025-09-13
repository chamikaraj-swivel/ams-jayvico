import { Injectable, OnModuleInit } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class FirestoreService implements OnModuleInit {
  private firestore: Firestore;

  async onModuleInit() {
    try {
      // Initialize Firestore
      this.firestore = new Firestore({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'jayvico-ams',
        // Use emulator if specified, otherwise use real Firebase
        ...(process.env.FIRESTORE_EMULATOR_HOST ? {
          host: process.env.FIRESTORE_EMULATOR_HOST,
          ssl: false,
        } : {
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        }),
      });

      console.log('✅ Firestore connection initialized');
      console.log(`📊 Using ${process.env.FIRESTORE_EMULATOR_HOST ? 'Emulator' : 'Real Firebase'}`);
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

}

