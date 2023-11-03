import { IsDate, IsOptional, IsString } from "class-validator";

 
export class CreateGeneralInfosDto { 
    
    @IsOptional()
    @IsDate()
    releaseDate: Date;
 
    @IsString()
    brand:string;

    @IsOptional()
    @IsString()
    model:string;
 
    @IsOptional()
    @IsString()
    connectivity:string;

}
