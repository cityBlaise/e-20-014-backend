import { Image } from '@Entities/image/image.entity';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encode } from 'blurhash';
import { randomUUID } from 'crypto';
import { constants, existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path'
import * as sharp from 'sharp';
import { Repository } from 'typeorm';

@Injectable()
export class AssetsService {

    constructor(
        @InjectRepository(Image) private readonly imageRepository: Repository<Image>
    ) { }


    async updload(file: Express.Multer.File) {

        const imageId = randomUUID().toString()
        const folderPath = join(__dirname, '../../../Uploads')
        const imageBuffer = file.buffer;
        let { data: pixels, info: metadata } = await sharp(imageBuffer).raw().ensureAlpha().toBuffer(
            { resolveWithObject: true }
        )

        try {

            if (!existsSync(folderPath))
                mkdirSync(folderPath, constants.O_RDWR)


            if (!['.webp', '.gif'].includes(extname(file.originalname))) {
                const imagePath = join(folderPath, imageId + '.webp')
                const bufferWebp = await sharp(imageBuffer).webp({
                    quality: 80, force: true,
                }).resize(metadata.width > 320 ? 320 : metadata.width).toBuffer()
                writeFileSync(imagePath, bufferWebp);
            } else {
                const imagePathOriginal = join(folderPath, imageId + extname(file.originalname))
                writeFileSync(imagePathOriginal, imageBuffer);

            }
            const { data: pixels2, info: metadata2 } = await sharp(imageBuffer).resize(500).raw().ensureAlpha().toBuffer(
                { resolveWithObject: true }
            )
            const blurhash = encode(
                new Uint8ClampedArray(pixels2),
                metadata2.width,
                metadata2.height,
                4,
                4
            );
            const imgEntity = this.imageRepository.create({
                image_id: imageId,
                path: imageId + '.webp',
                blurhash: blurhash
            })
            return this.imageRepository.save(imgEntity)
        } catch (error) {
            throw new HttpException(error.code, HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }

    async findAll(offset: number, limit: number) {
        const images = await this.imageRepository.find(
            {
                skip: offset,
                take: limit
            });
        return images
    }

    async findOne(id: string) {
        const image = await this.imageRepository.findOne({ where: { image_id: id } })
        if (!image) {
            throw new NotFoundException(`image #${id} not found`)
        }
        return image
    }
}
