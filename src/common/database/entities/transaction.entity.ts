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

  @Column()
  timestamp: number;

  @Column()
  eventName: string;

  @Column()
  totalValue: number;

  @Column()
  coinValue: number;

  @Column()
  tokenValue: number;

  @Column()
  hash: string;

  @Column()
  blockNumber: number;
}
