import { Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreService } from '../../common/firestore/firestore.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class CustomerService {
  constructor(private readonly firestoreService: FirestoreService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customersCollection = this.firestoreService.getCustomersCollection();
    const now = new Date().toISOString();
    
    const customerData = {
      ...createCustomerDto,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await customersCollection.add(customerData);
    
    return {
      id: docRef.id,
      ...customerData,
    };
  }

  async findAll(): Promise<Customer[]> {
    const customersCollection = this.firestoreService.getCustomersCollection();
    const snapshot = await customersCollection.orderBy('createdAt', 'desc').get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Customer[];
  }

  async findOne(id: string): Promise<Customer> {
    const customersCollection = this.firestoreService.getCustomersCollection();
    const doc = await customersCollection.doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customersCollection = this.firestoreService.getCustomersCollection();
    const docRef = customersCollection.doc(id);
    
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const updateData = {
      ...updateCustomerDto,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as Customer;
  }

  async remove(id: string): Promise<void> {
    const customersCollection = this.firestoreService.getCustomersCollection();
    const docRef = customersCollection.doc(id);
    
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    await docRef.delete();
  }
}

