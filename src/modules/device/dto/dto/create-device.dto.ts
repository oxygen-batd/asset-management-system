import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
export class CreateDeviceDto {

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
