import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pi_tickets')
export class PiTicketEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'from_iteration', type: 'int', default: '2', nullable: false })
    fromIteration!: number;

    @Column({ name: 'to_iteration', type: 'int', default: '2', nullable: false })
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
