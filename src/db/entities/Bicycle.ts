import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { Rental } from './Rental';
import { Review } from './Review';

@Entity("bicycles")
export class Bicycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  type: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price_per_hour: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: "available" })
  status: string; // available / maintenance / archived

  @OneToMany(() => Rental, rental => rental.bicycle)
  rentals: Rental[];

  @OneToMany(() => Review, review => review.bicycle)
  reviews: Review[];

  // @OneToMany(() => StationBicycle, sb => sb.bicycle)
  // stationBicycles: StationBicycle[];
}