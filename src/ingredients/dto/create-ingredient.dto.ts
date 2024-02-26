import { IsInt, IsNumber, IsString } from "class-validator";

export class CreateIngredientDto {

    @IsString()
    name:string;

    @IsString()
    provider:string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsInt()
    stock: number;
}
