import { ArrayMinSize, IsArray, IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class UpdateDeviceDto {

    @IsNotEmpty()
    @IsString()
    readonly serial: string;

    @IsNotEmpty()
    @IsEnum(['active', 'inactive'])
    readonly status: string;

    @IsOptional()
    @IsString()
    readonly description?: string;

    @IsOptional()
    @IsString()
    readonly type?: string;

    @IsNotEmpty()
    readonly locationId: string;

    @IsNotEmpty()
    readonly organizationId: string; 
}