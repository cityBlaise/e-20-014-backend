import { CreateDetailsDto } from "@Entities/details/dto/create-details.dto";
import { CreateGeneralInfosDto } from "@Entities/general_infos/dto/create-general_infos.dto";
import { IsOptional, IsString, IsUUID } from "class-validator";

  
export class CreateTechnicalInfoDto {  

    @IsOptional()
    @IsUUID()
    @IsString()
    fiche_technique_id:string;

    @IsOptional()
    generalInfo:CreateGeneralInfosDto

    @IsOptional()
    details:CreateDetailsDto

}
