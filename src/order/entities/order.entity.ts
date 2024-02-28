import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Client } from '../../client/entities/client.entity';
import { Discount } from '../../discount//entities//discount.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Client)
    @JoinColumn({name: "clientId"})
    client: Client;

    @Column('text')
    details: string;

    @ManyToMany(type => Product)
    @JoinTable()
    products: Product[];

    @ManyToOne(type => Discount)
    @JoinColumn()
    discount: Discount;

    @Column()
    total: number;

    @Column()
    advance: number;

    @Column()
    status: boolean;
}