import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./transaction.entity";

@Entity()
export class Protocol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  protocolAddress: string;

  @Column()
  protocolName: string;

  @Column()
  protocolType: string;

  @OneToMany(() => Transaction, (transaction) => transaction.protocol)
  transactions: Transaction[];
}
