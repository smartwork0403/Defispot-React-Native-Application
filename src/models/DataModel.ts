import { FeeOption } from '@thorwallet/xchain-client'

export interface DataModel {
  baseCurrency: string
  isSettingOpen: boolean
  slippageTolerance: number
  feeOptionType: FeeOption
  showAnnouncement: boolean
  affiliates: string[] | null
}
