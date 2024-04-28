import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { HttpService,HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Product,Ingredient]),HttpModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
