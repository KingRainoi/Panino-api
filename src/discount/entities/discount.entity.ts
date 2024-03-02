import { Order } from 'src/order/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Discount{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'json' })
    products: { name: string, quantity: number }[];

    @Column('float')
    discountRate: number;

    @Column()
    active: boolean;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => Order, (order) => order.discount)
    orders: Order[];
}