import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNumber, IsString, ValidateNested } from "class-validator";

class ProductDiscount {
    @IsString()
    name: string;

    @IsNumber()
    quantity: number;
}

export class CreateDiscountDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDiscount)
    products: ProductDiscount[];

    @IsNumber()
    discountRate: number;

    @IsBoolean()
    active: boolean;

    
    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    @IsDate()
    startDate: Date;

    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    @IsDate()
    endDate: Date;
}
