import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  bicycle_id: number;

  @Column('text')
  text: string;

  @Column('int')
  rating: number;
}
