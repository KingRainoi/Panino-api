import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from './entities/discount.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class DiscountService {

  constructor(
    @InjectRepository(Discount) 
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    ) {}

  async create(createDiscountDto: CreateDiscountDto) {
      const discount = new Discount();
      discount.name = createDiscountDto.name;
      discount.description = createDiscountDto.description;
      discount.discountRate = createDiscountDto.discountRate;
      discount.active = createDiscountDto.active;
      discount.start_date = new Date(createDiscountDto.startDate);
      discount.end_date = new Date(createDiscountDto.endDate);

      // Valida que cada producto exista
      for (const productDiscount of createDiscountDto.products) {
        const product = await this.productRepository.findOne({ where: { name: productDiscount.name } });
        if (!product) {
          throw new BadRequestException(`Product with name ${productDiscount.name} does not exist`);
        }
      }

      discount.products = createDiscountDto.products;

      return this.discountRepository.save(discount);
  }

  async findAll() {
    return await this.discountRepository.find();
  }

  async findOne(id: number) {
    return await this.discountRepository.findOneBy({id});
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    try {const discount = await this.discountRepository.findOne({
      where: { id: id }
    })

    if(!discount) {
      throw new BadRequestException(`Discount with id ${id} not found`);
    }

    if(updateDiscountDto.name !== undefined) {
      discount.name = updateDiscountDto.name;
    }

    if(updateDiscountDto.description !== undefined) {
      discount.description = updateDiscountDto.description;
    }

    if(updateDiscountDto.discountRate !== undefined) {
      discount.discountRate = updateDiscountDto.discountRate;
    }

    if(updateDiscountDto.active !== undefined) {
      discount.active = updateDiscountDto.active;
    }

    if(updateDiscountDto.startDate !== undefined) {
      discount.start_date = new Date(updateDiscountDto.startDate);
    }
    if(updateDiscountDto.endDate !== undefined) {
      discount.end_date = new Date(updateDiscountDto.endDate);
    }

    // Update products (if defined)
    if (updateDiscountDto.products !== undefined) {
      discount.products = updateDiscountDto.products;
    }

    return await this.discountRepository.save(discount);
  } catch (error) {
    throw new BadRequestException(error.message);
  }
  }

  async remove(id: number) {
    return await this.discountRepository.softDelete({id});
  }
}
