import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class ProductsInOrder {
    @IsString()
    name: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number;
}

export class CreateOrderDto {

    @IsString()
    details: string;

    @IsNotEmpty()
    @IsString()
    client: String;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductsInOrder)
    products: ProductsInOrder[];

    @IsString()
    discount: string;
    
    @IsNumber()
    advance: number;

    @IsNumber()
    total: number;

    @IsBoolean()
    status: boolean;
}