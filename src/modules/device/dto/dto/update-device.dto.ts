import { ArrayMinSize, IsArray, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDeviceDto {

    @IsNotEmpty()
    readonly locationId: string;

    @IsNotEmpty()
    readonly organizationId: string;

    @IsNotEmpty()
    readonly status: boolean;
}