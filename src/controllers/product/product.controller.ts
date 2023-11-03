import { ValidateOptionalFilePipe } from '@Common/validateOptionalFilePipe';
import { UpdateProductDto } from '@Entities/product/dto/update-product.dto';
import { PriceEnum, PriceFilter, PriceFilterDto } from '@Entities/product/filter/price.filter';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateProductDto } from 'src/entities/product/dto/create-product.dto';
import { ProductService } from 'src/services/product/product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async findAll(@Query() queries: (PaginationQueryDto & {price:string})) {
        let priceFilter
        const { limit, offset, price } = queries  
        return await this.productService.findAll(offset, limit,price)
    }

    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    async create(@UploadedFiles(new ValidateOptionalFilePipe())
    files: Express.Multer.File[], @Body() body: CreateProductDto) {
        console.log(body,files)
        return (files && files.length > 0) ?
            await this.productService.create(body, files) :
            await this.productService.create(body)
    }

    @Delete(':id')
    async delete(@Param('id') product_id: string) {
        return await this.productService.delete(product_id)
    }

    @Patch(':id')
    @UseInterceptors(FilesInterceptor('image'))
    async update(@UploadedFiles(new ValidateOptionalFilePipe()) files: Express.Multer.File[], @Param('id') product_id: string, @Body() body: UpdateProductDto) {
        return await this.productService.update(product_id, body, files)
    }

    @Get(':id')
    async findOne(@Param('id') product_id: string) {
        return await this.productService.findOne(product_id)
    }
}
