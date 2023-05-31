import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SampleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sampleColumn: string;
}
