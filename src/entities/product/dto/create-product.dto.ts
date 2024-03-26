import { IsHexColor, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, ValidateNested, isString } from "class-validator";
import { CreateTechnicalInfoDto } from "@Entities/technical_info/dto/create-technical_info.dto";
import { Type } from "class-transformer";
import { CreateProductVariantDto } from "./create-productVariant.dto";

export class CreateProductDto {
    constructor(data: Partial<CreateProductDto>) {
        Object.assign(this, data);
    }

    @IsString()
    @Length(3)
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string

    @IsOptional()
    @IsString({ each: true })
    colors: string[];

    @IsPositive()
    @IsNumber({ maxDecimalPlaces: 3 })
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
    images: string[]

    @IsOptional()
    @Type(() => CreateTechnicalInfoDto)
    ficheTechnique: CreateTechnicalInfoDto;

    @IsOptional()
    @IsString({ each: true })
    categories: string[]

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantDto)
    variants: CreateProductVariantDto[]
}
 