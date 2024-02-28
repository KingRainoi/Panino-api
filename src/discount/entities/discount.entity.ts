import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

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
}