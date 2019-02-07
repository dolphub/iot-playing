import { Controller, Get, Inject, Post, HttpCode, Param, Body, UsePipes, Patch } from '@nestjs/common';
import { Twin } from 'azure-iothub';

import { DeviceService } from '../services/device.service';
import { ValidationPipe } from '../pipes/validation.pipe';
import { IsString, IsInt } from 'class-validator';
import { DeviceState } from './DeviceState';
import { PhotoService } from '../modules/photos/photo.service';
import { Photo } from '../modules/photos/photo.entity';

class BasicDto {
    @IsString()
    readonly name?: string;

    @IsInt()
    readonly age: number;

    @IsString()
    readonly breed?: string;
}

@Controller('devices')
export class DeviceController {
    constructor(
        private readonly deviceService: DeviceService        
    ) { }

    @Get()
    async getAll(): Promise<Twin[]> {
        return await this.deviceService.getAllDeviceTwins();
    }

    @Get(':id')
    async getDevice(@Param('id') id: string | number): Promise<Twin> {
        return await this.deviceService.getDeviceTwinById(id);
    }

    @Patch(':id/state')
    async updateDevice(@Body() deviceState: DeviceState, @Param('id') id: string): Promise<any> {
        return { deviceState, id };
    }
}
