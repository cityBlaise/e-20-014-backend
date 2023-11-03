import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

 
export class CreateProductVariantDto {  
  
    @IsOptional()
    color: string; 

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
    parent: string;

    @IsString({each:true})
    images: string[]
}
