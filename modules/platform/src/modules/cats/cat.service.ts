import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// import { CreateCatDto } from './dto/create-Cat.dto';
import { Cat, CatDTO } from './cat.model';
import { CatSchema } from './cat.model';

@Component()
export class CatService {
    constructor(@InjectModel(CatSchema) private readonly catModel: Model<Cat>) {}
    async findAll () {
        return await this.catModel.find().exec()
    }

    async createCat(obj: CatDTO): Promise<Cat> {
        const createdCat = new this.catModel(obj);
        return await createdCat.save();
    }
}