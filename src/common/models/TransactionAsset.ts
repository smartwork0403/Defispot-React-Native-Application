import { Asset } from 'multichain-sdk'

export interface TransactionAsset {
  address: string
  txId: string
  url: string
  name: string
  amount: string
  asset: Asset
  icon: string
}
