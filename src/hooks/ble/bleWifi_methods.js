const getNetworks = async (uBle,characteristicsMap) => {
    console.log("getNetworks man",characteristicsMap['WIFI_NETWORKS'].UUID);
  const networks = await uBle.read(characteristicsMap['WIFI_NETWORKS'].UUID);
  console.log('---------- networks xyz -------------',characteristicsMap['WIFI_NETWORKS'], networks);
  return networks;
}

export {
    getNetworks
}