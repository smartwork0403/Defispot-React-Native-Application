import { ActionStatusEnum, Metadata } from 'midgard-sdk'

import { TransactionAsset } from './TransactionAsset'

export interface TransactionItem {
  displayName: string
  type: string
  date?: string
  inAssets: TransactionAsset[]
  outAssets: TransactionAsset[]
  metadata: Metadata
  status: ActionStatusEnum
}
