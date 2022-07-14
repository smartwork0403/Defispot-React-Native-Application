import {calculateGraphData} from '../common/helper/calculateGraphData';

import {
  setThorchainChartData,
  setTotalThorchainChartData,
  setThorchainChartLoading,
} from './wallet/slice';

export const initThorchainChartData = async store => {
  try {
    store.dispatch(setThorchainChartLoading(true));
    const res = await fetch(
      `${process.env.REACT_APP_API_V1_URL}/get/graph/data`,
    );

    const {
      graph: {data},
    } = await res.json();

    // temp: set chart for ETH, find ETH
    // const eth = data.find((ass) => ass.assetName === 'ETH.ETH')
    store.dispatch(setThorchainChartData(data));
    const totalData = calculateGraphData(data);
    if (totalData) {
      store.dispatch(setTotalThorchainChartData(totalData));
    }
    // setSelectedAssetChartData(eth)

    // console.log(data)
    store.dispatch(setThorchainChartLoading(false));
  } catch (e) {
    store.dispatch(setThorchainChartLoading(true));
    console.log(e);
  }
};

export async function initApp(store) {
  await initThorchainChartData(store);
}
