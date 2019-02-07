
import { Component, Inject } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';

@Component()
export class PhotoService {
    constructor(
        /* Disabled due to jest testing module resolution error */
        // @InjectRepository(Photo)
        // private readonly photoRepository: Repository<Photo>
    ) {}

    async getAllPhotos(): Promise<Photo[]> {
        return [];
        // return await this.photoRepository.find();
    }

    async createPhoto(photo: Photo): Promise<Photo> {
        return;
        // return await this.photoRepository.save(photo);
    }
}