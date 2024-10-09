import { ArrayMinSize, IsArray, IsString, IsNotEmpty } from 'class-validator';
export class CreateOrganizationDto {
    @IsNotEmpty()
    readonly name: string;
}
