import { IsNumber, IsString } from "class-validator";

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

    
}
