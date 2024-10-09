import { ArrayMinSize, IsArray, IsString, IsNotEmpty } from 'class-validator';
export class CreateDeviceDto {
    @IsNotEmpty()
    readonly locationId: string;

    @IsNotEmpty()
    readonly organizationId: string;

    @IsNotEmpty()
    readonly status: boolean;
}
