import { ArgumentMetadata, BadRequestException, FileTypeValidator, Injectable, MaxFileSizeValidator, PipeTransform } from "@nestjs/common";

@Injectable()
export class ValidateOptionalFilePipe implements PipeTransform {
    transform(value: Express.Multer.File[]  , metadata: ArgumentMetadata) {
        if (!value) {
            return value; // No file provided, so no need to perform validation
        } 

        const fileTypeValidator = new FileTypeValidator({ fileType: /image\/(jpe?g|png|webp|gif|avif)$/i })
        const maxSizeValidator = new MaxFileSizeValidator({ maxSize: 41943040 });
 

            (value).forEach(element => { 
                if (!fileTypeValidator.isValid(element))
                    throw new BadRequestException('Validation failed (expected type is /image(jpe?g|png|webp|gif|avif)$/i)');
                // If a file is provided, apply the MaxFileSizeValidator
                if (!maxSizeValidator.isValid(element))
                    throw new BadRequestException('Validation failed (expected size is less or equal than 5MB)');
            });
 
        return value;
    }
}