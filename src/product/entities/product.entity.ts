import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToMany, JoinTable} from 'typeorm';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column('text')
    description: string;

    @Column('float')
    price: number;

    @Column('int')
    stock: number;

    @Column('text')
    image: string;

    @ManyToMany(type => Ingredient, ingredient => ingredient.products)
    @JoinTable()
    ingredients: Ingredient[];

    @DeleteDateColumn()
    deletedAt: Date;
}