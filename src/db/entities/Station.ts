import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  bicycles_count: number;
}
