import { Entity, Column, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column('text')
    details: string;

    @Column({ length: 25 })
    phone: string;

    @OneToMany(type => Order, order => order.client)
    orders: Order[];

    @DeleteDateColumn()
    deletedAt: Date;
}
