import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pi_tickets')
export class PiTicketEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('numeric', { name: 'from_index' })
    fromIteration!: number;

    @Column('numeric', { name: 'to_index' })
    toIteration!: number;

    // @Column({ name: 'initial_pi' })
    // initialPi!: string;

    @Column({ name: 'result', nullable: true })
    result?: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', precision: 3 })
    createdAt: Date;

    // @Column('numeric', { name: 'timeout' })
    // timeout!: number;
}
