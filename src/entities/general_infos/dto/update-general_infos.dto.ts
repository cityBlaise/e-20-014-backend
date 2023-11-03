import { PartialType } from "@nestjs/mapped-types";
import { CreateGeneralInfosDto } from "./create-general_infos.dto";

 
export class UpdateGeneralInfosDto extends PartialType(CreateGeneralInfosDto) { }
