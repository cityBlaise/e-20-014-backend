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
import { ProductVariant } from '@Entities/product/productVariant.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './typeOrm.config';
@Module({
  imports: [

    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
 
 
    TypeOrmModule.forFeature([Product,Image,Categorie,TechnicalInfo,Details,GeneralInfos,ProductVariant]), 
    ServeStaticModule.forRoot({ 
      rootPath: join(__dirname, '..', 'Uploads'),
      // exclude: ['/api/(.*)'],
      serveRoot:'/images'
    }), 
  ],
  controllers: [AppController, ProductController, AssetController, CategorieController,],
  providers: [AppService, ProductService, AssetsService, CategorieService],
})
export class AppModule { }
