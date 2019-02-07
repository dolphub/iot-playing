import { Controller, Get, Post, Body } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatDTO } from './cat.model';

@Controller('cats')
export class CatController {
    constructor(
        private readonly catService: CatService
    ){ }

    @Get()
    async getAll(): Promise<any> {
        return await this.catService.findAll();
    }

    @Post()
    async createCat(@Body() body: CatDTO): Promise<any> {
        return await this.catService.createCat(body);
    }
}