import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, DeleteDateColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column()
    provider:string;

    @Column()
    description: string;

    @Column('double')
    price: number;

    @Column()
    stock: number;

    @ManyToMany(type => Product, product => product.ingredients)
    products: Product[];

    @DeleteDateColumn()
    deletedAt: Date;
}

