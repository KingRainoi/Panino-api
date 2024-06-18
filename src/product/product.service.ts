import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { OdooAuthClient,OdooActionsClient } from '../Integrations/odoo/client.odoo';
import { odooDb, odooPassword, odooUsername } from '../Integrations/odoo/credentials';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    private readonly httpService: HttpService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    //local product
    const product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    product.stock = createProductDto.stock;
    product.image = createProductDto.image;

    //odoo
    try {
      // Authenticate with Odoo
      OdooAuthClient.methodCall('authenticate', [odooDb, odooUsername, odooPassword, {}], async (error, uid) => {
        if (error) {
          console.error('Authentication failed:', error);
          return;
        } else {
          console.log('User authenticated successfully. User ID:', uid);
          
          // If user has access rights, create the product
          OdooActionsClient.methodCall('execute_kw', [odooDb, uid, odooPassword, 'product.product', 'create', [{
            name: createProductDto.name,
            list_price: createProductDto.price,
            
          }]], (err, productId) => {
            if (err) {
              console.error('Failed to create product:', err);
            } else {
              console.log('Product created successfully. Product ID:', productId);
              product.id = productId;
            }
          });
        } 
        }
      );
    } catch(e) {
      console.log(e);
    }

    // Find the ingredients by their names
    product.ingredients = await this.ingredientRepository.find({
        where: createProductDto.ingredientNames.map(name => ({ name })),
    });

    const newProduct = this.productRepository.save(product);
    console.log("This i sthe product ID",(await newProduct).id);
    const id = (await newProduct).id;
    //prestashop
    const url = 'http://54.224.249.75:8080/admin5251u73ax7jvtm1cpei/create-products.php?secure_key=ed3fa1ce558e1c2528cfbaa3f9940';
    const data = {
      "price": product.price,
      "name":product.name,
      "status":1,
      "reference": id.toString(),
      "description":product.description,
      "quantity":product.stock
    }
    try {
      await axios.post(url, data);
    } catch (e) {
      console.log('This is the error from prestashop',e);
    }
    return newProduct;
  }

  async findAll() {
    return await this.productRepository.find({ relations: ['ingredients'] });
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOneBy({id});
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Error fetching product');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ 
      where: { id: id }
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Update other fields of the product
    if (updateProductDto.name !== undefined) {
      product.name = updateProductDto.name;
    }
    if (updateProductDto.description !== undefined) {
        product.description = updateProductDto.description;
    }
    if (updateProductDto.price !== undefined) {
        product.price = updateProductDto.price;
    }
    if (updateProductDto.stock !== undefined) {
        product.stock = updateProductDto.stock;
    }
    if (updateProductDto.image !== undefined) {
        product.image = updateProductDto.image;
    }
    if (updateProductDto.ingredientNames) {
        product.ingredients = await this.ingredientRepository.find({
            where: updateProductDto.ingredientNames.map(name => ({ name })),
        });
    }

    //Prestashop
    const url = 'http://54.224.249.75:8080/admin5251u73ax7jvtm1cpei/update-product.php?secure_key=ed3fa1ce558e1c2528cfbaa3f9940';
    const ref = id.toString();
    console.log(ref);
    console.log(product.name);
    const data = {
      "price": product.price,
      "reference": ref,
      "description":product.description,
      "quantity":450,
      "name":product.name,
      "state":1
    }
    console.log(data);
    try {
      await axios.put(url, data);
    } catch (e) {
      console.log('This is the error from prestashop',e);
    }

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const ref = id.toString();
    const product = await this.productRepository.findOne({ 
      where: { id: id }
    });
    const url = 'http://54.224.249.75:8080/admin5251u73ax7jvtm1cpei/update-product.php?secure_key=ed3fa1ce558e1c2528cfbaa3f9940';
    console.log(ref);
    const data = {
      "price": product?.price,
      "reference": ref,
      "description":product?.description,
      "quantity":product?.stock,
      "name":product?.name,
      "state":0
    }
    try {
      await axios.put(url,data);
    }
    catch(e) {
      console.log('This is the error from prestashop', e);
    }
    
    return await this.productRepository.softDelete({id});
  }
}
