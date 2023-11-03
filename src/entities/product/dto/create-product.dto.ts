import { IsHexColor, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, ValidateNested } from "class-validator";
import { CreateCategorieDto } from "@Entities/categorie/dto/create-categorie.dto";
import { CreateTechnicalInfoDto } from "@Entities/technical_info/dto/create-technical_info.dto";

export class CreateProductDto { 

    @IsString()
    @Length(3)
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsNotEmpty()
    description: string
 
    @IsOptional()
    @IsHexColor()
    color: string;
 
    @IsPositive()
    @IsNumber({maxDecimalPlaces:3})
    price: number;
 
    @IsPositive()
    @IsInt() 
    amount: number;

    @IsOptional()
    @IsInt() 
    @IsPositive()
    rating: number;

    @IsOptional()
    @IsString({ each: true })
    images: string []

    @IsOptional()
    ficheTechnique:  CreateTechnicalInfoDto;

    @IsOptional({ each: true })
    categories: (string | CreateCategorieDto)[] 

    @IsOptional({ each: true })
    @IsString({ each: true })
    variants: string[]
}
