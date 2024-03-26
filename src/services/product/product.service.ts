import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '@Entities/image/image.entity';
import { CreateProductDto } from '@Entities/product/dto/create-product.dto';
import { Product } from '@Entities/product/product.entity';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { AssetsService } from '@Services/asset/assets.service';
import { UpdateProductDto } from '@Entities/product/dto/update-product.dto';
import { TechnicalInfo } from '@Entities/technical_info/technical_info.entity';
import { Details } from '@Entities/details/details.entity';
import { GeneralInfos } from '@Entities/general_infos/general_infos.entity';
import { CreateTechnicalInfoDto } from '@Entities/technical_info/dto/create-technical_info.dto';
import { PriceEnum, PriceFilter } from '@Entities/product/filter/price.filter';
import { CategorieService } from '@Services/categorie/categorie.service';
import { CreateProductVariantDto } from '@Entities/product/dto/create-productVariant.dto';
import { ProductVariant } from '@Entities/product/productVariant.entity';

type productFields = {
    name?: string;

    description?: string

    colors?: string[];

    price?: number;

    amount?: number;

    rating?: number;
}
@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductVariant) private readonly productVariantRepository: Repository<ProductVariant>,
        @InjectRepository(TechnicalInfo) private readonly technicalInfoRepository: Repository<TechnicalInfo>,
        @InjectRepository(Details) private readonly detailsRepository: Repository<Details>,
        @InjectRepository(Image) private readonly imagesRepository: Repository<Image>,
        @InjectRepository(GeneralInfos) private readonly generalInfoRepository: Repository<GeneralInfos>,
        private readonly assetService: AssetsService,
        private readonly categoryService: CategorieService,
    ) { }

    findAll(offset: number, limit: number, price: string) {
        // let query = this.productRepository.createQueryBuilder('prod')
        //     .leftJoinAndSelect('prod.images', 'images')
        //     .leftJoinAndSelect('prod.variants', 'variants')
        //     .leftJoinAndSelect(
        //         qb => qb
        //           .select()
        //           .from(ProductVariant, 'va')
        //           .leftJoinAndSelect('va.images', 'images') ,
        //         'prod.variants',
        //         'prod.variants.parent = prod.product_id'
        //       )
        //     .leftJoinAndSelect('prod.categories', 'categories')
        //     .orderBy('prod.createdAt', 'DESC');
        // query = this.applyPriceFilter<Product>(price, query)
        // return query.
        //     skip(offset)
        //     .take(limit)
        //     .getMany();

        return this.productRepository.find(
            {
                relations: {
                    images: true,
                    variants: {
                        images: true
                    },
                },
                skip: offset,
                take: limit,
                order: { createdAt: 'DESC' }
            });
    }

    applyPriceFilter<T extends ObjectLiteral>(price: string = '', querie: SelectQueryBuilder<T>) {
        if (price) {
            try {
                let priceObject: PriceFilter = JSON.parse(price)

                if (!isNaN(priceObject.amount) || !isNaN(priceObject.operator) || !Object.values(PriceEnum).includes(priceObject.operator?.toString())) {
                    let queryString = ''
                    if (priceObject.operator == PriceEnum.DIFFERENT) {
                        queryString = `prod.price <> :price`
                    } else if (priceObject.operator == PriceEnum.EQUAL) {
                        queryString = `prod.price = :price`
                    } else if (priceObject.operator == PriceEnum.GREATHER) {
                        queryString = `prod.price > :price`
                    } else if (priceObject.operator == PriceEnum.GREATHER_EQUAL) {
                        queryString = `prod.price >= :price`
                    } else if (priceObject.operator == PriceEnum.LESS) {
                        queryString = `prod.price < :price`
                    } else {
                        queryString = `prod.price <= :price`
                    }
                    console.log(queryString, priceObject.operator)
                    querie.
                        where(queryString, { price: priceObject.amount })
                }
            } catch (error) {
                console.log(error)
            }
        }
        return querie
    }

    async create(body: CreateProductDto, files: Express.Multer.File[] = []) {
        const doublon = await this.productRepository.findOne({ where: { name: body.name.toLowerCase() } })
        if (doublon) {
            throw new HttpException(`product name \"${body.name}\" already taken`, HttpStatus.CONFLICT)
        }

        const images = await this.preloadImages(files)
        const ficheTechnique = body.ficheTechnique ? this.preloadTechnicalInfos(body.ficheTechnique) : null;
        const categories = await this.preloadCategoryByIds(body.categories)
        console.log(categories)
        const fields: productFields = body
        fields.name = fields.name?.toLocaleLowerCase()

        const product = this.productRepository.create({
            ...fields,
            images: body.images.map(name => images[name]),
            categories,
            ficheTechnique,
        })
        const mainProduct = await this.productRepository.save(product)
        await Promise.all(body.variants.map(variant => {
            const _images = variant.images.map(name => images[name])
            return this.createVariant(variant, _images, product)
        }))
        return mainProduct
    }

    async createVariant(payload: CreateProductVariantDto, images: Image[] = [], parent: Product) {
        const fields: productFields = payload
        delete fields.name
        const variant = this.productVariantRepository.create({
            ...fields,
            images,
            parent,
        })
        return this.productVariantRepository.save(variant)
    }


    async delete(product_id: string) {
        // const product = await this.findOne(product_id)
        // product.ficheTechnique && product.ficheTechnique.generalInfo && await this.generalInfoRepository.remove(product.ficheTechnique.generalInfo)
        // product.ficheTechnique && product.ficheTechnique.details && await this.detailsRepository.remove(product.ficheTechnique.details)
        // product.ficheTechnique && await this.technicalInfoRepository.remove(product.ficheTechnique)
        // return this.productRepository.remove(product)
    }

    async findOne(product_id: string) {
        const product = await this.productRepository.findOne({
            where: { product_id },
            relations: {
                images: true,
                variants: {
                    images: true
                },
            },
        })
        if (!product) {
            throw new NotFoundException(`product #${product_id} not found`)
        }
        return product
    }

    // async update(product_id: string, body: UpdateProductDto, files: Express.Multer.File[] = []) {
    // this.findOne(product_id)
    // if (body.name) {
    //     const doublon = await this.productRepository.findOne({ where: { name: body.name.toLowerCase() } })
    //     if (doublon)
    //         throw new HttpException(`name "${body.name}" already taken`, HttpStatus.CONFLICT)
    // }

    // const images = await this.preloadImages(files, body.images)
    // body.ficheTechnique =
    //     (body.ficheTechnique && !body.ficheTechnique.fiche_technique_id) ?
    //         this.preloadTechnicalInfos(body.ficheTechnique)
    //         : (
    //             (body.ficheTechnique && body.ficheTechnique.fiche_technique_id) ?
    //                 await this.preloadTechnicalInfosWithId(body.ficheTechnique, body.ficheTechnique.fiche_technique_id)
    //                 : body.ficheTechnique
    //         );

    // const fields: productWithoutImageCategorie = body
    // const existingproduct = await this.productRepository.preload({
    //     product_id,
    //     ...fields,
    //     ficheTechnique: body.ficheTechnique,
    //     images
    // })
    // await this.productRepository.save(existingproduct!)
    // return this.findOne(product_id)
    // }

    preloadTechnicalInfos(payload: CreateTechnicalInfoDto) {
        if (payload.details) {
            payload.details = this.detailsRepository.create(payload.details)
        }

        if (payload.generalInfo) {
            payload.generalInfo = this.generalInfoRepository.create(payload.generalInfo)
        }
        return this.technicalInfoRepository.create(payload)
    }

    async preloadImages(files: Express.Multer.File[] = []) {
        if (files.length === 0)
            return {}

        const record: Record<string, Image> = {}
        const Images = await Promise.all(files.map(file => this.assetService.updload(file)),)
        Images.forEach((image, index) => {
            const name = files[index].originalname
            record[name] = image
        })
        return record
    }

    async preloadCategoryByIds(payload: string[] = []) {
        return payload.length == 0 ? [] : await Promise.all(payload.map(id => this.categoryService.findOne(id)))
    }



}
