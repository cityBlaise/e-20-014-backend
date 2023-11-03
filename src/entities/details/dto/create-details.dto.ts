import { IsBoolean, IsInt, IsOptional } from "class-validator";

  
export class CreateDetailsDto {  
 
    @IsBoolean()
    microphone:boolean;
     
    @IsBoolean()
    waterResistant:boolean;
     
    @IsInt()
    @IsOptional()
    weight:number;
     
    @IsInt()
    @IsOptional()
    batterieLife:number;

}
