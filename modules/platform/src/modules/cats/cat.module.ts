import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CatSchema } from './cat.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Cat', schema: CatSchema }])],
    components: [CatService],
    exports: [CatService],
    controllers: [CatController]
})
export class CatModule {};