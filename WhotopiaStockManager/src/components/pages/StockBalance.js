import React from "react";
import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { StockBalanceHistoryModal } from "../StockBalanceHistoryModal";
import { dataSet, orgUnit, groupHistoryData } from "../../utils";

import {
  Box,
  Button,
  IconDimensionData16,
  Table,
  Input,
  TableHead,
  TableCellHead,
  TableBody,
  TableRow,
  TableRowHead,
  TableCell,
} from "@dhis2/ui";

import { filterData, search, sortData, period, yyyy } from "../../utils";

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
      startDate: `${yyyy}`,
      endDate: `${yyyy + 1}`,
      dataSet: dataSet,
      dataElementIdScheme: "name",
    },
  },
};

function historyButton(showModal, setName, name) {
  return (
    <Button
      onClick={() => showModalSetName(showModal, setName, name)}
      icon={<IconDimensionData16 />}
    />
  );
}

function showModalSetName(showModal, setName, name) {
  showModal(() => true);
  setName(() => name);
}
export function StockBalance(props) {
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [name, setName] = useState("");

  const { loading, error, data } = useDataQuery(request);
  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <span>Loading...</span>;
  }

  if (data) {
    let groupedValues = Object.groupBy(
      data.currentData.dataValues,
      ({ dataElement }) => dataElement
    );
    groupedValues = Object.values(groupedValues);
    let commodities = search(sortData(filterData(groupedValues)), searchVal);
    let history = groupHistoryData(data.historyReq.dataValues);
    let value = "";
    return (
      <>
        <Box>
          <h1>Stock Balance Sheet</h1>
          <p>
            Below is the current stock balance for all commodities. Commodities
            that are low in stock are marked in red. The buttons shows the
            history for year {yyyy} for its respective commodity.
          </p>
        </Box>
        {showModal && (
          <StockBalanceHistoryModal
            name={name}
            log={history[name]}
            setShowModal={setShowModal}
          />
        )}
        <Box>
          <Input
            placeholder="Search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.value.toLowerCase())}
          ></Input>
          <Table>
            <TableHead>
              <TableRowHead>
                <TableCellHead>Commodity</TableCellHead>
                <TableCellHead>Stock Balance</TableCellHead>
                <TableCellHead>Stock Balance History</TableCellHead>
              </TableRowHead>
            </TableHead>
            <TableBody>
              {commodities.map((row) => {
                row[2] <= 10
                  ? (value = (
                      <span style={{ color: "red" }}>{row[2]} (low stock)</span>
                    ))
                  : (value = row[2]);
                return (
                  <TableRow key={Math.random()}>
                    <TableCell>{row[0]}</TableCell>
                    <TableCell>{value}</TableCell>
                    <TableCell>
                      {historyButton(setShowModal, setName, row[0])}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </>
    );
  }
}
