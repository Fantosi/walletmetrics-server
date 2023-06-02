import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Transaction } from "./transaction.entity";
import { Asset } from "./asset.entity";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  walletAddress: string;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  @OneToMany(() => Asset, (asset) => asset.wallets)
  assets: Asset[];

  @Column()
  transactionNum: number;
}
