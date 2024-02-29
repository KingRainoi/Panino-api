import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column('text')
    details: string;

    @Column({ length: 14 })
    phone: string;

    @OneToMany((type: any) => Order, order => order.client)
    // Inicializa el arreglo vacío
    orders: Order[] = []; 
}
