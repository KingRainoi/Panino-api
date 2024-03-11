import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { OdooAuthClient,OdooActionsClient } from '../Integrations/odoo/client.odoo';
import { odooDb, odooPassword, odooUsername } from '../Integrations/odoo/credentials';

@Injectable()
export class ClientService {

  constructor (
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>
  ) {}

  async create(createClientDto: CreateClientDto) {
    //Creates client in odoo database
    
      //Odoo version
      OdooAuthClient.methodCall('version', [], function (error, value) {
        if (error){
          console.log('Error when calling a method: '+ error);
          return;
        }
        console.log('Method response for version: ', value);
      });
      console.log('That was the version of my odoo');
      // Authenticate with Odoo
      OdooAuthClient.methodCall('authenticate', [odooDb, odooUsername, odooPassword, {}], (error,uid) => {
        if (error) {
          console.error('Authentication failed:', error);
          return ;
        } else {
          //Print the version of the client in the console
          console.log(OdooAuthClient.options.port);
          //get uid
          console.log("this is the user id"+ uid);
          //
          
          //
          OdooActionsClient.methodCall('execute_kw', [odooDb, 2, odooPassword, 'res.partner', 'check_access_rights', ['read'], {'raise_exception': false}], (error, value) => {
            if (error) {
                console.error('Error checking access rights:', error);
            } else {
                console.log('Access rights checked successfully:', value);
            }
          });
        
          // Call the Odoo create method to create the order
          OdooActionsClient.methodCall('execute_kw', [odooDb, 2, odooPassword, 'res.partner', 'create', [{
            name: createClientDto.name,
            email: createClientDto.email
          }]], (err) => {
            if (err) {
              console.error('Failed to create order:', err);
            } else {
              console.log('Customer created successfully. Order ID:', 1);
            }
          });
        }
      });
   

    //Creates the client in database
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