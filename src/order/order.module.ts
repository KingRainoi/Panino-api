import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Client } from '../client/entities/client.entity';
import { Discount } from '../discount/entities/discount.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order,Client,Discount,Product])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
