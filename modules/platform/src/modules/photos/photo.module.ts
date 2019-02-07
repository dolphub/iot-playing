import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo } from './photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo])], // Disabled for testing... need to resolve
  components: [PhotoService],
  controllers: [PhotoController],
  exports: [PhotoService]
})
export class PhotoModule {}
