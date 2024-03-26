import { IsDate, IsOptional, IsString } from "class-validator";

 
export class CreateGeneralInfosDto { 

    constructor(data: Partial<CreateGeneralInfosDto>) {
        Object.assign(this, data);
    }
    
    @IsOptional()
    @IsDate()
    releaseDate: Date;
 
    @IsString()
    @IsOptional()
    brand:string;

    @IsOptional()
    @IsString()
    model:string;
 
    @IsOptional()
    @IsString()
    connectivity:string;

}
