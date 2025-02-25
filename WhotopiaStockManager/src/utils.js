export const baseUrl = "http://localhost:9999";
export const dataSet = "ULowA8V3ucd"; // Live Saving commodites
export const orgUnit = "lPeZdUm9fD7"; // OrgUnit
export const namespace = "IN5320-255";

const date = new Date();
let mm = date.getMonth() + 1;
export const yyyy = date.getFullYear();
export const period = `${yyyy}${mm}`; // Period

export const consID = "J2Qf1jtZuj8";
export const endBID = "rQLFnNXXIL0";
export const qtboID = "KPP63zJPkOu";

export function filterData(data) {
  // => [[name, consVal, endBVal, qtboVal]]
  let dataFiltered = [];
  for (let i = 0; i < data.length; i++) {
    let dataRow = ["name", 0, 0, 0];
    dataRow[0] = data[i][0].dataElement.substring(14);

    for (let j = 0; j < data[i].length; j++) {
      let coc = data[i][j].categoryOptionCombo;
      let val = data[i][j].value;

      if (coc == consID) {
        dataRow[1] = val;
      }

      if (coc == endBID) {
        dataRow[2] = val;
      }

      if (coc == qtboID) {
        dataRow[3] = val;
      }
    }
    dataFiltered.push(dataRow);
  }

  return dataFiltered;
}

export function search(data, searchVal) {
  if (searchVal != "") {
    data = data.filter((item) => item[0].toLowerCase().includes(searchVal));
  }
  return data;
}

export function sortData(data) {
  //sort by name: [[name, consVal, endBVal, qtboVal]]
  //                ^^^^
  //ty https://stackoverflow.com/questions/34599303/javascript-sort-list-of-lists-by-sublist-second-entry
  return data.sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });
}

// input
// http://localhost:9999/api/dataValueSets?orgUnit=lPeZdUm9fD7&startDate=2023&endDate=2024&dataSet=ULowA8V3ucd
// output
// {Commodity: [[period,endbalVal]]}
// eksempel
// {Zinc: [["202309","4"], ["202310","3"]], Female Condoms: [["202309","4"], ["202310","3"]]} osv
export function groupHistoryData(data) {
  let logPerCommodity = {};
  let groupedValues = Object.groupBy(data, ({ dataElement }) => dataElement);
  groupedValues = Object.values(groupedValues);
  for (let i = 0; i < groupedValues.length; i++) {
    let name = groupedValues[i][1]["dataElement"].substring(14);
    logPerCommodity[name] = [];
    for (let j = 0; j < groupedValues[i].length; j++) {
      let cocID = groupedValues[i][j]["categoryOptionCombo"];
      if (cocID == "rQLFnNXXIL0") {
        // end balance
        let pperiod = groupedValues[i][j]["period"];
        if (pperiod < period) {
          let value = groupedValues[i][j]["value"];
          logPerCommodity[name].push([pperiod, value]);
        }
      }
    }
  }
  return logPerCommodity;
}
