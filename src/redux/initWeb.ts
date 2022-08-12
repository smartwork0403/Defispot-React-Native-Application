import {calculateGraphData} from '../common/helper/calculateGraphData';
import {setThorchainChartData} from './wallet/slice';
import {REACT_APP_API_V1_URL} from '@env';

export const initThorchainChartData = async () => {
  try {
    const res = await fetch(`${REACT_APP_API_V1_URL}/get/graph/data`);

    const {
      graph: {data},
    } = await res.json();

    // temp: set chart for ETH, find ETH
    // const eth = data.find((ass) => ass.assetName === 'ETH.ETH')
    const totalData = calculateGraphData(data);
    if (totalData) {
      setThorchainChartData(totalData);
    }
  } catch (e) {
    console.log(e);
  }
};
