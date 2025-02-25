import React from "react";
import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";

import classes from "../../App.module.css";

import {
  AlertBar,
  Box,
  Button,
  CircularLoader,
  Input,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";

import { filterData, search, sortData } from "../../utils";
import { ConfirmationModal } from "../ConfirmationModal";

import {
  dataSet,
  orgUnit,
  period,
} from "../../utils";


const request = {
  request0: {
    resource: "/dataValueSets",
    params: {
      dataSet: dataSet,
      orgUnit: orgUnit,
      period: period,
      dataElementIdScheme: "name",
      // mulig å få inn id også?
    },
  },
};

function sendOrder(order) {
  document.getElementsByName("consumption").value = "";
  order(true);
}

export function ConsumptionReporting(props) {
  const { loading, error, data } = useDataQuery(request);
  const [searchVal, setSearchVal] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    let groupedValues = Object.groupBy(
      data.request0.dataValues,
      ({ dataElement }) => dataElement
    );
    groupedValues = Object.values(groupedValues);
    let commodites = search(sortData(filterData(groupedValues)), searchVal);
    return (
      <Box>
        <Box>
          <h1>Consumption Reporting Form</h1>
          <p>Below is an order form where you can order commodities individually, or several at once.</p>
          <div className={classes.buttonPadding}>
            <Button primary onClick={() => setShowModal(true)}>
              Send order
            </Button>
          </div>
          {orderComplete && (
            <div
              className="alert-bars"
              style={{
                bottom: 0,
                left: 600,
                position: "fixed",
                width: "100%",
              }}
            >
              <AlertBar
                success
                duration={5000}
                onHidden={() => setOrderComplete(false)}
              >
                Order has been sent!
              </AlertBar>
            </div>
          )}
          {showModal && (
            <ConfirmationModal
              title="Order Confirmation"
              message="Do you want to send the order?"
              setShowModal={setShowModal}
              setOrderComplete={setOrderComplete}
              sendOrder={sendOrder}
            />
          )}
          <Input
            placeholder="Search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.value.toLowerCase())}
          ></Input>
        </Box>
        <Box>
          <Table>
            <TableHead>
              <TableRowHead>
                <TableCellHead></TableCellHead>
                <TableCellHead>Consumption</TableCellHead>
                <TableCellHead>End balance</TableCellHead>
                <TableCellHead>Quantity to be ordered</TableCellHead>
              </TableRowHead>
              <TableRowHead>
                <TableCellHead>Commodity</TableCellHead>
                <TableCellHead>A</TableCellHead>
                <TableCellHead>B</TableCellHead>
                <TableCellHead>C</TableCellHead>
              </TableRowHead>
            </TableHead>
            <TableBody>
              {commodites.map((row) => {
                return (
                  <TableRow key={Math.random()}>
                    <TableCell>{row[0]}</TableCell>
                    <TableCell>
                      <Input value={row[1]} readOnly />
                    </TableCell>
                    <TableCell>
                      <Input value={row[2]} readOnly />
                    </TableCell>
                    <TableCell>
                      <Input
                        name="consumption"
                        type="number"
                        min="0"
                        placeholder={`Suggestion ${row[3]}`}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Box>
    );
  }
}
