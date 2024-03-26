import { Categorie } from '@Entities/categorie/categorie.entity';
import { CreateCategorieDto } from '@Entities/categorie/dto/create-categorie.dto';
import { Image } from '@Entities/image/image.entity';
import { AssetsService } from '@Services/asset/assets.service';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CategorieService {

    constructor(
        @InjectRepository(Categorie) private readonly categorieRepository: Repository<Categorie>,
        private readonly assetService: AssetsService
    ) { }

    findAll(offset: number, limit: number) {
        return this.categorieRepository.find(
            {
                order: { createdAt: "ASC" },
                relations: { image: true },
                skip: offset,
                take: limit
            });
    }

    async search(querie: string) {
        const data = await this.categorieRepository.find(
            {
                select: {
                    categorie_id: true,
                    name: true,
                },
                where: {
                    name: ILike(`%${querie}%`)
                },
                order: { name: "ASC" },
            });
        const response:{id:string,name:string}[]= data.map(c=>{
            return {id:c.categorie_id,name:c.name}
        }) 
        return response
    }

    async findOne(categorie_id: string) {
        const category = await this.categorieRepository.findOneBy({ categorie_id })
        if (!category) {
            throw new NotFoundException(`category #${categorie_id} not found`)
        }
        return category
    }

    async create(body: CreateCategorieDto) {
        const doublon = await this.categorieRepository.findOne({ where: { name: body.name.toLowerCase() } })
        if (doublon)
            throw new HttpException(`name "${body.name}" already taken`, HttpStatus.CONFLICT)

        let image: Image = body.image ? await this.assetService.findOne(body.image) : new Image()
        const categorie = this.categorieRepository.create({
            ...body,
            image
        })
        return this.categorieRepository.save(categorie)
    }

    async createWithImage(body: CreateCategorieDto, file: Express.Multer.File) {
        const doublon = await this.categorieRepository.findOne({ where: { name: body.name.toLowerCase() } })
        if (doublon)
            throw new HttpException(`name "${body.name}" already taken`, HttpStatus.CONFLICT)

        const image = await this.assetService.updload(file)
        console.log('image sent to the database')

        const categorie = this.categorieRepository.create({
            ...body,
            image
        })
        return this.categorieRepository.save(categorie)
    }

    async delete(categorie_id: string) {
        const categorie = await this.findOne(categorie_id)
        return this.categorieRepository.remove(categorie)
    }
}
