import { IsOptional, IsString, Length } from "class-validator";

export class CreateCategorieDto{

    @IsString()
    @Length(1)
    name:string;

    @IsOptional()
    @IsString()
    image:string 
}