import { IsInt, IsNumber, IsString, IsArray } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsInt()
    stock: number;

    @IsString()
    image: string;

    @IsArray()
    @IsString({ each: true })
    ingredientNames: string[];
}
