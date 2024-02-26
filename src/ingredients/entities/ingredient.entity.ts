import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToMany } from 'typeorm';
//const { Entity, Column, PrimaryGeneratedColumn } = require('typeorm');

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

    @DeleteDateColumn()
    deletedAt: Date;
}

