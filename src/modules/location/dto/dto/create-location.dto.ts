import { ArrayMinSize, IsArray, IsString, IsNotEmpty } from 'class-validator';
export class CreateLocationDto {
    @IsNotEmpty()
    readonly name: string;
}
