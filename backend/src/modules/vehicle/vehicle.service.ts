import { Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreService } from '../../common/firestore/firestore.service';
import { CreateVehicleDto, UpdateVehicleDto, VehicleStatus } from './dto/vehicle.dto';

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  status: VehicleStatus;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class VehicleService {
  constructor(private readonly firestoreService: FirestoreService) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const vehiclesCollection = this.firestoreService.getVehiclesCollection();
    const now = new Date().toISOString();
    
    const vehicleData = {
      ...createVehicleDto,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await vehiclesCollection.add(vehicleData);
    
    return {
      id: docRef.id,
      ...vehicleData,
    };
  }

  async findAll(status?: string): Promise<Vehicle[]> {
    const vehiclesCollection = this.firestoreService.getVehiclesCollection();
    let query = vehiclesCollection.orderBy('createdAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Vehicle[];
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehiclesCollection = this.firestoreService.getVehiclesCollection();
    const doc = await vehiclesCollection.doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehiclesCollection = this.firestoreService.getVehiclesCollection();
    const docRef = vehiclesCollection.doc(id);
    
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    const updateData = {
      ...updateVehicleDto,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as Vehicle;
  }

  async remove(id: string): Promise<void> {
    const vehiclesCollection = this.firestoreService.getVehiclesCollection();
    const docRef = vehiclesCollection.doc(id);
    
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    await docRef.delete();
  }
}

