import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Rental } from "./Rental";
import { Review } from "./Review";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: "user" })
  role: "user" | "admin";

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  registered_at: Date;

  @OneToMany(() => Rental, rental => rental.user)
  rentals: Rental[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];
}
