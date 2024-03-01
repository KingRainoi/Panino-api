import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class ClientService {

  constructor (
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>
  ) {}

  async create(createClientDto: CreateClientDto) {
    return await this.clientRepository.save(createClientDto);
  }

  async findAll() {
    return await this.clientRepository.find();
  }

  async findOne(id: number) {
    return await this.clientRepository.findBy({id});
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.createQueryBuilder('client')
        .leftJoinAndSelect('client.orders', 'order')
        .where('client.id = :id', { id })
        .getOne();

    const orders = await this.ordersRepository.findByIds(updateClientDto.orderIds);

    if(client === null) {
      throw new BadRequestException(`Client with id ${id} not found`);
    }

    client.orders = orders;

    if(updateClientDto.name !== undefined) {
      client.name = updateClientDto.name;
    }

    if(updateClientDto.phone !== undefined) {
      client.phone = updateClientDto.phone;
    }

    if(updateClientDto.details!== undefined) {
      client.details = updateClientDto.details;
    }

    return this.clientRepository.save(client);
  }


  async remove(id: number) {
    return await this.clientRepository.softDelete({id});
  }
}