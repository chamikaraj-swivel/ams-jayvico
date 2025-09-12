import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';

export enum VehicleStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in-transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class CreateVehicleDto {
  @ApiProperty({ description: 'Vehicle VIN number' })
  @IsString()
  vin: string;

  @ApiProperty({ description: 'Vehicle make' })
  @IsString()
  make: string;

  @ApiProperty({ description: 'Vehicle model' })
  @IsString()
  model: string;

  @ApiProperty({ description: 'Vehicle year' })
  @IsNumber()
  year: number;

  @ApiProperty({ description: 'Vehicle color' })
  @IsString()
  color: string;

  @ApiProperty({ description: 'Vehicle status', enum: VehicleStatus })
  @IsEnum(VehicleStatus)
  status: VehicleStatus;

  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  customerId: string;
}

export class UpdateVehicleDto {
  @ApiProperty({ description: 'Vehicle VIN number', required: false })
  @IsOptional()
  @IsString()
  vin?: string;

  @ApiProperty({ description: 'Vehicle make', required: false })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiProperty({ description: 'Vehicle model', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ description: 'Vehicle year', required: false })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiProperty({ description: 'Vehicle color', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ description: 'Vehicle status', enum: VehicleStatus, required: false })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiProperty({ description: 'Customer ID', required: false })
  @IsOptional()
  @IsString()
  customerId?: string;
}

