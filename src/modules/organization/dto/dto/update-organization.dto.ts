import { ArrayMinSize, IsArray, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrganizationDto {

    @IsNotEmpty()
    readonly name: string;
}