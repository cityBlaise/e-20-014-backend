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

type productWithoutImageCategorie = {
    name?: string;

    description?: string

    color?: string;

    price?: number;

    amount?: number;

    rating?: number;
}
@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(TechnicalInfo) private readonly technicalInfoRepository: Repository<TechnicalInfo>,
        @InjectRepository(Details) private readonly detailsRepository: Repository<Details>,
        @InjectRepository(Image) private readonly imagesRepository: Repository<Image>,
        @InjectRepository(GeneralInfos) private readonly generalInfoRepository: Repository<GeneralInfos>,
        private readonly assetService: AssetsService
    ) { }

    findAll(offset: number, limit: number, price: string) {
        let query = this.productRepository.createQueryBuilder('prod')
            .leftJoinAndSelect('prod.images', 'images')
            .orderBy('prod.createdAt', 'DESC');
        query = this.applyPriceFilter<Product>(price, query)
        return query.
            skip(offset)
            .take(limit)
            .getMany();

        // return this.productRepository.find(
        //     {
        //         where: {

        //         },
        //         skip: offset,
        //         take: limit,
        //         order: { createdAt: 'DESC' }
        //     });
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
        // console.log(body.images)
        const doublon = await this.productRepository.findOne({ where: { name: body.name.toLowerCase() } })
        if (doublon)
            throw new HttpException(`name "${body.name}" already taken`, HttpStatus.CONFLICT)

        const images: Image[] = await this.preloadImages(files, body.images)
        body.ficheTechnique = this.preloadTechnicalInfos(body.ficheTechnique)
        console.log(images, body.ficheTechnique)

        const fields: productWithoutImageCategorie = body
        fields.name = fields.name?.toLocaleLowerCase()
        let product = this.productRepository.create({
            ...fields,
            images,
            ficheTechnique: body.ficheTechnique,
        })
        await this.productRepository.save(product)
        return this.findOne(product.product_id)
    }


    async delete(product_id: string) {
        const product = await this.findOne(product_id)
        product.ficheTechnique && product.ficheTechnique.generalInfo && await this.generalInfoRepository.remove(product.ficheTechnique.generalInfo)
        product.ficheTechnique && product.ficheTechnique.details && await this.detailsRepository.remove(product.ficheTechnique.details)
        product.ficheTechnique && await this.technicalInfoRepository.remove(product.ficheTechnique)
       return this.productRepository.remove(product)
    }

    async findOne(product_id: string) {
        const product = await this.productRepository.findOneBy({ product_id })
        if (!product) {
            throw new NotFoundException(`product #${product_id} not found`)
        }
        return product
    }

    async update(product_id: string, body: UpdateProductDto, files: Express.Multer.File[] = []) {
        this.findOne(product_id)
        if (body.name) {
            const doublon = await this.productRepository.findOne({ where: { name: body.name.toLowerCase() } })
            if (doublon)
                throw new HttpException(`name "${body.name}" already taken`, HttpStatus.CONFLICT)
        }

        const images = await this.preloadImages(files, body.images)
        body.ficheTechnique =
            (body.ficheTechnique && !body.ficheTechnique.fiche_technique_id) ?
                this.preloadTechnicalInfos(body.ficheTechnique)
                : (
                    (body.ficheTechnique && body.ficheTechnique.fiche_technique_id) ?
                        await this.preloadTechnicalInfosWithId(body.ficheTechnique, body.ficheTechnique.fiche_technique_id)
                        : body.ficheTechnique
                );

        const fields: productWithoutImageCategorie = body
        const existingproduct = await this.productRepository.preload({
            product_id,
            ...fields,
            ficheTechnique: body.ficheTechnique,
            images
        })
        await this.productRepository.save(existingproduct!)
        return this.findOne(product_id)
    }

    preloadTechnicalInfos(payload: CreateTechnicalInfoDto) {
        if (payload) {
            if (payload.details) {
                payload.details = this.detailsRepository.create(payload.details)
            }

            if (payload.generalInfo) {
                payload.generalInfo = this.generalInfoRepository.create(payload.generalInfo)
            }
        }
        return payload
    }

    async preloadTechnicalInfosWithId(payload: CreateTechnicalInfoDto, id: string) {
        const tmp = await this.technicalInfoRepository.findOneBy({ fiche_technique_id: id })
        if (payload) {
            if (payload.details) {
                payload.details = this.detailsRepository.create({
                    details_id: tmp?.details.details_id,
                    ...payload.details
                })
            }

            if (payload.generalInfo) {
                payload.generalInfo = this.generalInfoRepository.create(
                    {
                        general_infos_id: tmp?.generalInfo.general_infos_id,
                        ...payload.generalInfo
                    })
            }
        }
        return payload
    }

    private preloadImageById(image_id: string): Promise<Image> {
        return this.assetService.findOne(image_id)
    }

    // async preloadImages(files: Express.Multer.File[] = [], imagesId: string[] | undefined = [],product_id?:string) {
    //     let presentsImages:Image[]=[]
    //     if(product_id && imagesId.length>0){
    //         presentsImages = await this.imagesRepository.find({where:{products:{product_id:product_id}}})
    //     }
    //     return Promise.all(
    //         [...files.map(file => this.assetService.updload(file)),
    //         ...imagesId.map(id => this.preloadImageById(id)),
    //         ...presentsImages
    //         ])
    // }
    async preloadImages(files: Express.Multer.File[] = [], imagesId: string[] | undefined = []) {
        console.log(imagesId + 'hh')
        if (!imagesId)
            return []
        return Promise.all(
            [...files.map(file => this.assetService.updload(file)),
            ...imagesId.map(id => this.preloadImageById(id)),
            ])
    }



}
