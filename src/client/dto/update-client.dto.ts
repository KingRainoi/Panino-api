import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsArray, IsNumber } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
    @IsArray()
    @IsNumber({}, { each: true })
    orderIds: number[];
}
