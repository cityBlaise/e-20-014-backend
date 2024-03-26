import { CreateDetailsDto } from "@Entities/details/dto/create-details.dto";
import { CreateGeneralInfosDto } from "@Entities/general_infos/dto/create-general_infos.dto";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";

  
export class CreateTechnicalInfoDto {   
    constructor(data: Partial<CreateTechnicalInfoDto>) {
        Object.assign(this, data);
    }

    @IsOptional()
    @Type(() => CreateGeneralInfosDto)
    generalInfo:CreateGeneralInfosDto
    
    @IsOptional()
    @Type(() => CreateDetailsDto)
    details:CreateDetailsDto

}
