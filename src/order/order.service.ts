import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/client/entities/client.entity';
import { Discount } from 'src/discount/entities/discount.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = new Order();
    order.details = createOrderDto.details;
    order.status = createOrderDto.status;
    order.advance = createOrderDto.advance;
    order.total = createOrderDto.total;

    //Validate client exists and if they do add them
    const clientName = createOrderDto.client.toString();
    const client = await this.clientRepository.findOne({where: {name: clientName}});
    if (!client) {
      throw new BadRequestException(`Client with ID ${createOrderDto.client} does not exist`);
    }
    order.client = client;

    //Validate the product actually exists and if they do add them 
    for(const productSearch of createOrderDto.products) {
      const product = await this.productRepository.findOne({where: {name: productSearch.name}});
      if(!product) {
        throw new BadRequestException(`Product with name ${productSearch.name} does not exist`);
      }
    }
    order.products = createOrderDto.products;
    
    //Validate the discount actually exists and if they do add them
    const discount = await this.discountRepository.findOne({where: {name: createOrderDto.discount}});
    if(!discount) {
      throw new BadRequestException(`Discount with ID ${createOrderDto.discount} does not exist`);
    }
    order.discount = discount;
    
    return this.orderRepository.save(order);
  }

  async findAll() {
    return await this.orderRepository.find({relations: ['client']});
  }

  async findOne(id: number) {
    return await this.orderRepository.findBy({id});
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    // Find the order along with its relations
    const order = await this.orderRepository.findOne({
      where: {id: id},
      relations: ['client', 'products', 'discount']
    });
    //Validate order exists
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Update the order fields
    Object.assign(order, updateOrderDto);

    // If the products are being updated, validate the new products
    if (updateOrderDto.products) {
      for (const productSearch of updateOrderDto.products) {
        const product = await this.productRepository.findOne({where: {name: productSearch.name}});
        if (!product) {
          throw new BadRequestException(`Product with name ${productSearch.name} does not exist`);
        }
      }
      order.products = updateOrderDto.products;
    }

    // Save the updated order
    return await this.orderRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({
      where: {id: id},
      relations: ['client']
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
  
     // Save the client in a variable
    const client = await this.clientRepository.findOne({
      where: {id: order.client.id},
      relations: ['orders']
    });
    
    //Validate client is not null
    if(client === null) {
      throw new BadRequestException(`Client with id ${order.client.id} not found`);
    }

    // Remove the order from the client's orders array
    client.orders = client.orders.filter(o => o.id !== id);
    
    // Save the client
    await this.clientRepository.save(client);

    return await this.orderRepository.softDelete({id});
  }
}