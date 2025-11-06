import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';


@Entity("stations")
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column({ nullable: true })
  name: string;

  // @OneToMany(() => StationBicycle, sb => sb.station)
  // stationBicycles: StationBicycle[];
}
