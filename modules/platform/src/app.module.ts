import { Module, NestModule, RequestMethod } from '@nestjs/common';

import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import * as path from 'path';

// import AppComponents from './components';
// import AppControllers from './controllers';
import { PhotoModule } from './modules/photos/photo.module';
import { CatModule } from './modules/cats/cat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

const GlobalMiddlewares = [
    morgan(':method :url :status - :response-time ms'),
    bodyParser
];


const DATASTORE_CONNECTION_STRING = 
    process.env.DATASTORE_CONNECTION_URI || 'mongodb://localhost/platform';

@Module({
    imports: [
        MongooseModule.forRoot(DATASTORE_CONNECTION_STRING),
        // @TODO Move to module based file system        
        TypeOrmModule.forRoot({
            "type": "mysql",
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "example",
            "database": "test",
            "entities": [path.join(__dirname, "./**/**.entity{.ts,.js}")],
            "synchronize": true
          }),
        CatModule,
        PhotoModule
    ],
    // controllers: AppControllers,
    // components: AppComponents,
})
export class ApplicationModule implements NestModule {
    configure(consumer: any): void | any {
        consumer
            .apply(GlobalMiddlewares)
            .with('ApplicationModule')
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}