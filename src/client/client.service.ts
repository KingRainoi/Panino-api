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
    return await this.clientRepository.find({relations: ['orders']});
  }

  async findOne(id: number) {
    return await this.clientRepository.findOne({
      where: {id: id},
      relations: ['orders']
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    return this.clientRepository.update({id},updateClientDto);
  }

  async remove(id: number) {
    return await this.clientRepository.softDelete({id});
  }
}