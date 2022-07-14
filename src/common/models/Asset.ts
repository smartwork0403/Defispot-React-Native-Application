import { AssetChart } from './AssetChart'

export interface Asset {
  assetName?: string
  graphData1D: AssetChart[]
  graphData1Hr: AssetChart[]
  graphData1M: AssetChart[]
  graphData1Y: AssetChart[]
  _id?: string
}
