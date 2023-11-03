import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetController } from '@Controllers/asset/asset.controller';
import { CategorieController } from '@Controllers/categorie/categorie.controller';
import { ProductController } from '@Controllers/product/product.controller';
import { Categorie } from '@Entities/categorie/categorie.entity';
import { Product } from '@Entities/product/product.entity';
import { AssetsService } from '@Services/asset/assets.service';
import { CategorieService } from '@Services/categorie/categorie.service';
import { ProductService } from '@Services/product/product.service';
import { Image } from '@Entities/image/image.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TechnicalInfo } from '@Entities/technical_info/technical_info.entity';
import { Details } from '@Entities/details/details.entity';
import { GeneralInfos } from '@Entities/general_infos/general_infos.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql-e20-014-e-20-014.a.aivencloud.com',
      port: 12752,
      username: 'avnadmin',
      charset:"utf8mb4",
      password: 'AVNS_-GAwyiKXOsEDdeULzUs',
      database: 'e-20-014', 
      entities: [__dirname + "/**/*.entity{.ts,.js}"],   
      synchronize: true,  
    }), 
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'gateway01.us-west-2.prod.aws.tidbcloud.com',
    //   port: 4000,
    //   username: '3k2fXCqFBjqCqQJ.root',
    //   password: 'lroqBpimIN2aT2P3',
    //   database: 'e-20-014', 
    //   entities: [__dirname + "/**/*.entity{.ts,.js}"],  
    //   ssl: {
    //     minVersion: 'TLSv1.2',
    //     rejectUnauthorized: true
    //   },
    //   synchronize: true,  
      
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: ' ',
    //   database: 'test',
    //   entities: [__dirname + "/**/*.entity{.ts,.js}"], 
    //   synchronize: true,
      // dropSchema:true
    // }),
    // TypeOrmModule.forRoot({
    //   type:'postgres',
    //   host:'localhost',
    //   port:5432,
    //   username:'postgres',
    //   password:'pass123',
    //   database:'postgres',
    //   synchronize:true,
    // }),
    TypeOrmModule.forFeature([Product,Image,Categorie,TechnicalInfo,Details,GeneralInfos]),
    // TypeOrmModule.forFeature([Product,Image,Categorie,TechnicalInfo,Details,GeneralInfos]),
    ServeStaticModule.forRoot({
      // renderPath:'/images',
      
      rootPath: join(__dirname, '..', 'Uploads'),
      exclude: ['/api/(.*)'],
    }),
    // MulterModule.register({dest:'./uploads'})
  ],
  controllers: [AppController, ProductController, AssetController, CategorieController,],
  providers: [AppService, ProductService, AssetsService, CategorieService],
})
export class AppModule { }
