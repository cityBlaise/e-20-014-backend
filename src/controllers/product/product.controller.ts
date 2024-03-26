import { ValidateOptionalFilePipe } from '@Common/validateOptionalFilePipe';
import { CreateProductDto } from '@Entities/product/dto/create-product.dto';
import { UpdateProductDto } from '@Entities/product/dto/update-product.dto';
// import { PriceEnum, PriceFilter, PriceFilterDto } from '@Entities/product/filter/price.filter';
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
// import { Request as RequestType } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ProductService } from 'src/services/product/product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async findAll(@Query() queries: (PaginationQueryDto & { price: string })) {
        let priceFilter
        const { limit, offset, price } = queries
        return await this.productService.findAll(offset, limit, price)
    }

    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    async create(
        @UploadedFiles(new ValidateOptionalFilePipe()) files: Express.Multer.File[],
        @Body() body: any
    ) {
        /**
         * payload validation
         */
        const data = plainToClass(CreateProductDto, JSON.parse(body.data));
        const errors: ValidationError[] = await validate(data);
        if (errors.length > 0) {
            throw new BadRequestException(errors.map(error => error.toString(false, true, undefined, true).trim()));
        }

        console.log(data)
        console.log(files)
        return (files && files.length > 0) ?
            await this.productService.create(data, files) :
            await this.productService.create(data);

    }

    @Delete(':id')
    async delete(@Param('id') product_id: string) {
        return await this.productService.delete(product_id)
    }

    // @Patch(':id')
    // @UseInterceptors(FilesInterceptor('image'))
    // async update(@UploadedFiles(new ValidateOptionalFilePipe()) files: Express.Multer.File[], @Param('id') product_id: string, @Body() body: UpdateProductDto) {
    //     return await this.productService.update(product_id, body, files)
    // }

    @Get(':id')
    async findOne(@Param('id') product_id: string) {
        return await this.productService.findOne(product_id)
    }

}
