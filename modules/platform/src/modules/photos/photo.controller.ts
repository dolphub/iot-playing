import { Controller, Get, Inject, Post, HttpCode, Param, Body, UsePipes, Patch } from '@nestjs/common';
import { Photo } from './photo.entity';
import { PhotoService } from './photo.service';

@Controller('photos')
export class PhotoController {
    constructor(
        private readonly photoService: PhotoService
    ) { }

    @Get()
    async getAll(): Promise<Photo[]> {
        return await this.photoService.getAllPhotos();
    }

    @Post()
    async createPhoto(@Body() photo: Photo): Promise<Photo> {
        return await this.photoService.createPhoto(photo);
    }
}
