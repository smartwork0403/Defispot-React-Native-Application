const convertTotal = data => {
  const timeStampForData = data[0].map(li => li.timeStamp);
  return timeStampForData.map(li => {
    const assetPriceUSDArr = data.map(at => {
      const result = at.find(mo => mo.timeStamp === li);
      return result ? result.assetPriceUSD : '0';
    });
    const totalAssetPriceUSD = assetPriceUSDArr.reduce(
      (a, b) => Number(a) + Number(b),
      0,
    );
    return {
      timeStamp: li,
      assetPriceUSD: totalAssetPriceUSD,
    };
  });
};

export const calculateGraphData = data => {
  const tempGraphData1D = data.map(li => li.graphData1D);
  const resultGraphData1D = convertTotal(tempGraphData1D);

  const tempGraphData1Hr = data.map(li => li.graphData1Hr);
  const resultGraphData1Hr = convertTotal(tempGraphData1Hr);

  const tempGraphData1M = data.map(li => li.graphData1M);
  const resultGraphData1M = convertTotal(tempGraphData1M);

  const tempGraphData1Y = data.map(li => li.graphData1Y);
  const resultGraphData1Y = convertTotal(tempGraphData1Y);

  return {
    graphData1D: resultGraphData1D,
    graphData1Hr: resultGraphData1Hr,
    graphData1M: resultGraphData1M,
    graphData1Y: resultGraphData1Y,
  };
};
