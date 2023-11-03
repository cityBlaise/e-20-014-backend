import { PaginationQueryDto } from '@Common/dto/pagination-query.dto';
import { ValidateOptionalFilePipe } from '@Common/validateOptionalFilePipe';
import { CreateCategorieDto } from '@Entities/categorie/dto/create-categorie.dto';
import { CategorieService } from '@Services/categorie/categorie.service';
import { Controller, Get, Post, Query, Body, UseInterceptors, UploadedFiles, Param, Delete} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('category')
export class CategorieController {
    constructor(
        private readonly categorieService: CategorieService,
    ) { }

    @Get()
    async findAll(@Query() paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery
        return await this.categorieService.findAll(offset, limit)
    }

    @Get('search')
    async search(@Query('query') query: string="") { 
        return await this.categorieService.search(query)
    }

    @Get(':id')
    async findOne(@Param('id') category_id: string) {
        return await this.categorieService.findOne(category_id)
    }


    @Post()
    @UseInterceptors(FilesInterceptor('image',))
    async create(@UploadedFiles( new ValidateOptionalFilePipe())
     file:  Express.Multer.File[], @Body() body: CreateCategorieDto) {
        console.log(file)
        return (!file|| file.length==0) ?
            await this.categorieService.create(body) :
            await this.categorieService.createWithImage(body, file[0])
    }

    @Delete(':id')
    async delete(@Param('id') category_id: string) {
        return await this.categorieService.delete(category_id)
    }
}
