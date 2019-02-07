import "reflect-metadata";
import { PipeTransform, ArgumentMetadata, BadRequestException, Pipe } from "@nestjs/common";
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { validate, ValidationError } from "class-validator";

@Pipe()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        
        let classObj = new metatype();
        const object = plainToClass(metatype, value);
        // whitelist / forbid disallows additional non-whitelisted properties on an object
        const errors = await validate(object, { whitelist: true, forbidNonWhitelisted: true });
        if (errors.length > 0) {
            throw new BadRequestException(`${metatype} - ${this.formatErrors(errors)}`);
        }
        

        return value;
    }

    /**
     * Formats various errors from both class-valdiator and class-transformer
     */
    private formatErrors(errors: any[]): any {
        errors.reduce
        return errors.reduce((acc: any[], x: any) => {
           if (x instanceof ValidationError)  {
               if (Object.keys(x.constraints).length > 0) {
                   acc = acc.concat(formatObject(x.constraints))
               }
               return acc = acc.concat(x.children.map(c => formatObject(c.constraints)));
           }
           acc.push(formatObject(x.constraints));
           return acc;
        }, []).join(', ');

        function formatObject(x: any): string[] {
            return Object.keys(x).map((key: string) => `${key}: ${x[key]}`);
        }
    }

    private toValidate(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
}