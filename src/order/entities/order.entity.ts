import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, JoinTable, ManyToMany, DeleteDateColumn } from 'typeorm';
import { Client } from '../../client/entities/client.entity';
import { Discount } from '../../discount//entities//discount.entity';

@Entity()
export class Order {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Client, (client) => client.orders)
    // Foreign key column name
    @JoinColumn({ name: 'clienId' }) 
    client: Client;

    @Column('text')
    details: string;

    @Column('json') // Store product names, quantities, and prices as JSON
    products: { name: string; quantity: number; price: number }[];

    @ManyToOne(() => Discount, (discount) => discount.orders)
    // Foreign key column name
    @JoinColumn({ name: 'discountid' }) 
    discount: Discount;

    @Column()
    total: number;

    @Column()
    advance: number;

    @Column()
    status: boolean;

    @DeleteDateColumn()
    deletedAt: Date;
}