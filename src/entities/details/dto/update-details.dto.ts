import { PartialType } from "@nestjs/mapped-types";
import { CreateDetailsDto } from "./create-details.dto";

  
export class UpdateDetailsDto extends PartialType (CreateDetailsDto) {}
