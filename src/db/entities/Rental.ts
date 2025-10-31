import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  bicycle_id: number;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @Column('decimal', { nullable: true })
  total_price: number;

  @Column({ default: 'active' })
  status: string;
}
