import React from "react";
import { dataSet, orgUnit, groupHistoryData, yyyy, period } from "../../utils";
import { useDataQuery } from "@dhis2/app-runtime";
import { useState, useEffect } from "react";
import classes from "../../App.module.css";

import { SingleSelectOption, Box, SingleSelect } from "@dhis2/ui";
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const request = {
  currentData: {
    resource: "/dataValueSets",
    params: {
      dataSet: dataSet,
      orgUnit: orgUnit,
      period: period,
      dataElementIdScheme: "name",
    },
  },
  historyReq: {
    resource: "/dataValueSets",
    params: {
      orgUnit: orgUnit,
      startDate: yyyy,
      endDate: `${yyyy + 1}`,
      dataSet: dataSet,
      dataElementIdScheme: "name",
    },
  },
};

function getData(data, setChartData) {
  let chartData = [];
  let splitData = [];

  for (let i = 0; i < data.length; i++) {
    splitData = data[i].toString().split(",");
    chartData.push({ name: splitData[0], 'End balance': splitData[1], amt: 100 });
  }
  setChartData(chartData);
}

export function Home(props) {
  const { loading, error, data } = useDataQuery(request);
  const [commodity, setCommodity] = useState("");
  const [activeHistory, setActiveHistory] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getData(activeHistory, setChartData);
  }, [activeHistory]); // Array containing which state changes that should re-reun useEffect()

  function setCommodityANDHistory(commodity, history) {
    setCommodity(() => commodity);
    setActiveHistory(() => history[commodity]);
  }
  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <span>Loading...</span>;
  }

  if (data) {
    let history = groupHistoryData(data.historyReq.dataValues);
    const commodites = Object.entries(history).map(([k, v]) => `${k}`);
    const currentData = data.currentData.dataValues;
    return (
      <>
        <h1>Home</h1>
        <h2>Commodities with low stock balance</h2>
        {currentData.map((data) => {
          if (data.categoryOptionCombo === "rQLFnNXXIL0" && data.value <= 10) {
            return (
              <ul>
                <li>
                  {data.dataElement.split("Commodities - ")}:{" "}
                  <span style={{ color: "red" }}>{data.value}</span>
                </li>
              </ul>
            );
          }
        })}
        <h2>Stock balance history</h2>
        <p>Select a commodity to display its history for {yyyy}</p>
        <Box width="250px">
          <SingleSelect
            className="select"
            onChange={(e) => setCommodityANDHistory(e.selected, history)}
            selected={commodity}
            placeholder="Select commodity"
          >
            {commodites.map((row) => {
              return <SingleSelectOption label={row} value={row} />;
            })}
          </SingleSelect>
        </Box>
        {chartData.length > 0 && (
          <div className={classes.chartPadding}>
            <LineChart width={1000} height={500} data={chartData}>
              <XAxis dataKey="name" />
              <YAxis type="number" domain={[0, 100]} />
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <Tooltip />
              <Legend
                width={150}
                wrapperStyle={{
                  top: 40,
                  right: 20,
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #d5d5d5",
                  borderRadius: 3,
                  lineHeight: "40px",
                }}
              />
              <Line
                type="monotone"
                dataKey="End balance"
                stroke="#82ca9d"
                strokeWidth={2}
              />
              <Brush />
            </LineChart>
          </div>
        )}
      </>
    );
  }
}
