import React from "react";
import { baseUrl, filterData, sortData, dataSet, period } from "../utils";
import { useState, useEffect } from "react";

import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";

export function OrgUnitCommodities(props) {
  let orgUnit = props.orgUnitID;
  const [apiData, setApiData] = useState([]);
  useEffect(() => {
    let apiQuery = `${baseUrl}/api/dataValueSets?orgUnit=${orgUnit}&period=${period}&dataSet=${dataSet}&dataElementIdScheme=name`;
    fetch(apiQuery)
      .then((results) => results.json())
      .then((data) => {
        // Then add response to state.
        setApiData(data);
      });
  }, [orgUnit]);

  if (!apiData.dataValues) {
    return <p>Select an organisation unit to display the data</p>;
  } else {
    let groupedValues = Object.groupBy(
      apiData.dataValues,
      ({ dataElement }) => dataElement
    );
    groupedValues = Object.values(groupedValues);
    let dataR = sortData(filterData(groupedValues));
    return (
      <Table>
        <TableHead>
          <TableRowHead>
            <TableCellHead>Commodity</TableCellHead>
            <TableCellHead>Amount available</TableCellHead>
            <TableCellHead>Amount to request</TableCellHead>
          </TableRowHead>
        </TableHead>
        <TableBody>
          {dataR.map((row) => {
            return (
              <TableRow key={Math.random()}>
                <TableCell>{row[0]}</TableCell>
                <TableCell>{row[2]}</TableCell>
                <TableCell>
                  <Input
                    name="requestValue"
                    type="number"
                    min="0"
                    max={row[2]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}
