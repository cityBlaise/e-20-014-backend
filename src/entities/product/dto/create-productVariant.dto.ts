import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

 
export class CreateProductVariantDto {  
    constructor(data: Partial<CreateProductVariantDto>) {
        Object.assign(this, data);
    }
    @IsOptional()
    @IsString({ each: true })
    colors: string[];

    @IsNumber()
    price: number;

    @IsPositive()
    @IsInt()
    @IsOptional()
    amount: number; 

    @IsPositive()
    @IsInt()
    @IsOptional()
    rating: number;  
    
    @IsString()
    @IsOptional()
    parent: string;

    @IsString({each:true})
    images: string[]
}
