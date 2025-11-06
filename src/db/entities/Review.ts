import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { User } from './User';
import { Bicycle } from './Bicycle';

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.reviews, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Bicycle, bicycle => bicycle.reviews, { onDelete: "CASCADE" })
  bicycle: Bicycle;

  @Column()
  text: string;

  @Column({ type: "int", default: 5 })
  rating: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}