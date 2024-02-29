import { IsBoolean, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class CreateClientDto {
    @IsString()
    name: string;

    @IsString()
    details: string;

    @IsPhoneNumber()
    phone: string;

    
}
