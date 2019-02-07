import { IsJSON, IsInstance, IsBoolean, IsNumber, ValidateNested, IsDefined, IsEmpty, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { isObject } from "util";
import { Type } from "class-transformer";

export class RecordTelemetry {

    @IsBoolean()
    enabled: Boolean;
        
    @IsOptional()
    @IsNumber({allowNaN: false, allowInfinity: false})
    frequencyMS: Number;
}

export class DeviceState {
    @ValidateNested()
    @Type(() => RecordTelemetry)
    recordTelemetry!: RecordTelemetry;
}