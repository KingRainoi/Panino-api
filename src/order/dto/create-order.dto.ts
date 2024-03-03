import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, Validate, ValidateNested } from "class-validator";
import { Client } from "../../client/entities/client.entity";

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