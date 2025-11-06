import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Bicycle } from './Bicycle';

@Entity("rentals")
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp" })
  start_date: Date;

  @Column({ type: "timestamp", nullable: true })
  end_date: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  total_price: number;

  @Column({ default: "active" })
  status: "active" | "completed" | "cancelled";

  @ManyToOne(() => User, user => user.rentals, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Bicycle, bicycle => bicycle.rentals, { onDelete: "CASCADE" })
  bicycle: Bicycle;
}
