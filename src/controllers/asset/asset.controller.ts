import { PaginationQueryDto } from '@Common/dto/pagination-query.dto';
import { AssetsService } from '@Services/asset/assets.service';
import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express'

@Controller('asset')
export class AssetController {

    constructor(
        private readonly assetService:AssetsService
    ){}


    @Get('image')
    async findAll(@Query() paginationQuery:PaginationQueryDto ){
        const {limit, offset} = paginationQuery
        return await this.assetService.findAll(offset,limit)
    }

    // @ApiNotFoundResponse({description:'coffee not found'})
    @Get('image/:id')
    async getCoffee(@Param('id') id:string){
        return await this.assetService.findOne(id)
    }

    @Post('image/upload')
    @UseInterceptors(FileInterceptor('image',))
    async uppload(@UploadedFile() file:Express.Multer.File,@Body() body:any){ 
        console.log('asset Controller')
        await this.assetService.updload(file) 
    }
}
