
export const grabDatas = async(itemId, rangeType) => {
    let tempChartKitData = [];
    const requestResult = await getGraphs(itemId,rangeType).catch((error) => {console.log("grab graph error")});
    if((requestResult.errCode == 200)){

        console.log(" HAA DATA :", requestResult.res)

        const testData = requestResult.res;

        console.log("TESSSSSST :", testData)


        let index = 1;
        let tempListGraph = [];
        for (const [key, value] of Object.entries(testData)) {
            const typeGrap = {key:index, value:key}
            let labels = [...value.map(i=> i.timestamp*1000)]
            //let labels = [...value.map(i=> (new Date(i.timestamp*1000)).toLocaleDateString("fr") )]
            const points = [...value.map(i=>i.value)]
            const typeLabelsPoints = {id:index, key:key, labels:labels, points:points} 
            console.log("GGGG :", typeLabelsPoints)
            tempListGraph.push(typeGrap)
            tempChartKitData.push(typeLabelsPoints)
            index = index +1
          }
       
    }

    return tempChartKitData;
}