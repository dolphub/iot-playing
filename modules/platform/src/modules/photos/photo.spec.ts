// import { Test } from '@nestjs/testing';
// import { PhotoController } from './photo.controller';
// import { PhotoService } from './photo.service';
// import { DatabaseModule } from '../../database/database.module';

// // Build repos that extend the repository model
// // https://github.com/nestjs/nest/issues/363#issuecomment-360105413

// describe('PhotoController', () => {
//     let photoController: PhotoController;
//     let photoService: PhotoService;

//     beforeEach(async () => {
//         const module = await Test.createTestingModule({
//             imports: [DatabaseModule],
//             controllers: [PhotoController],
//             components: [PhotoService],
//         }).compile();

//         photoService = module.get<PhotoService>(PhotoService);
//         photoController = module.get<PhotoController>(PhotoController);
//     });

//     describe('findAll', () => {
//         it('should return an array of photos', async () => {
//             const result = ['test'];
//             jest.spyOn(photoService, 'getAllPhotos').mockImplementation(() => result);

//             expect(await photoController.getAll()).toBe(result);
//         });
//     });
// });