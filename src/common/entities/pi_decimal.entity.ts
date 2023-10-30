import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pi_decimals')
export class PiDecimalEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column("numeric", { scale: 1, precision: 1000 })
    iteration!: number;

    @Column()
    result!: string;
}
