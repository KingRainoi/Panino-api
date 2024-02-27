import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    product.stock = createProductDto.stock;
    product.image = createProductDto.image;

    // Find the ingredients by their names
    product.ingredients = await this.ingredientRepository.find({
        where: createProductDto.ingredientNames.map(name => ({ name })),
    });

    return this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find({ relations: ['ingredients'] });
  }

  async findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ 
      where: { id: id },
      relations: ['ingredients'] 
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (updateProductDto.ingredientNames) {
        product.ingredients = await this.ingredientRepository.find({
            where: updateProductDto.ingredientNames.map(name => ({ name })),
        });
    }

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
