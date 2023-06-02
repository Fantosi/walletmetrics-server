import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Wallet } from "./wallet.entity";
import { Protocol } from "./protocol.entity";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  walletId: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @Column()
  protocolId: number;

  @ManyToOne(() => Protocol, (protocol) => protocol.transactions)
  protocol: Protocol;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @Column()
  eventName: string;

  @Column()
  totalValue: number;

  @Column()
  coinValue: number;

  @Column()
  tokenValue: number;
}
