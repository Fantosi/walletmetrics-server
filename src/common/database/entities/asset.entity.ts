import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Wallet } from "./wallet.entity";

export enum AssetType {
  FT = "FT",
  NFT = "NFT",
}

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: AssetType })
  assetType: AssetType;

  @Column({ type: "float" })
  price: number;

  @ManyToMany(() => Wallet, (wallet) => wallet.assets)
  @JoinTable()
  wallets: Wallet[];
}
