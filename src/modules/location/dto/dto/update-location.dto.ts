import { ArrayMinSize, IsArray, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateLocationDto {

    @IsNotEmpty()
    readonly name: string;
}