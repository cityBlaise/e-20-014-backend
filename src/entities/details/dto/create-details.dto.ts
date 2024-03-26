import { IsBoolean, IsInt, IsOptional } from "class-validator";


export class CreateDetailsDto {
    constructor(data: Partial<CreateDetailsDto>) {
        Object.assign(this, data);
    }

    @IsBoolean()
    @IsOptional()
    microphone: boolean;

    @IsBoolean()
    @IsOptional()
    waterResistant: boolean;

    @IsInt()
    @IsOptional()
    weight: number;

    @IsInt()
    @IsOptional()
    batterieLife: number;

}
