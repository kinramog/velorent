import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Bicycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  type: string;

  @Column('decimal')
  price_per_hour: number;

  @Column({ default: 'available' })
  status: string;

  @Column({ nullable: true })
  image_url: string;
}
