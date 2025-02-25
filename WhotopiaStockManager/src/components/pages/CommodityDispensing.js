import React from "react";
import { useState, useEffect } from "react";
import classes from "../../App.module.css";

import {
  AlertBar,
  Box,
  Button,
  Field,
  Input,
  SingleSelect,
  SingleSelectOption,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";

import {
  baseUrl,
  consID,
  dataSet,
  endBID,
  namespace,
  orgUnit,
  period,
} from "../../utils";

export function CommodityDispensing(props) {
  const [commodites, setCommodities] = useState([]);
  const [commodityId, setCommodityId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [updateComplete, setUpdateComplete] = useState(false);

  const [transaction, setTransaction] = useState({
    id: "",
    dateTime: "",
    commodity: "",
    amount: "",
    dispensedBy: "",
    dispensedTo: "",
  });

  useEffect(() => {
    getCommodities();
    getTransactions();
  }, []);

  async function getCommodities() {
    let res = await fetch(
      `${baseUrl}/api/dataSets/${dataSet}.json?fields=dataSetElements[dataElement[name,id]]`
    );
    let data = await res.json();
    let transformedData = data.dataSetElements.map((element) => {
      return {
        id: element["dataElement"]["id"],
        name: element["dataElement"]["name"].substring(14),
      };
    });
    let sortedData = transformedData.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    setCommodities(sortedData);
  }

  async function getTransactions() {
    let res = await fetch(
      `${baseUrl}/api/dataStore/${namespace}/Dispensing_Log`
    );
    setTransactions(await res.json());
  }

  function handleInputFieldChange(e) {
    transaction[e.name] = e.value;
    setTransaction(transaction);
  }

  async function handleNewTransaction() {
    await updateCommodity();
    await updateTransactions();
  }

  async function updateTransactions() {
    transaction.id = crypto.randomUUID();
    transaction.dateTime = new Date().toLocaleDateString();
    transaction.commodity = commodites.find((c) => c.id == commodityId).name;

    transactions.unshift(transaction);

    let res = await fetch(
      `${baseUrl}/api/dataStore/IN5320-255/Dispensing_Log`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactions),
      }
    );

    if (res.ok) {
      await getTransactions();
      setUpdateComplete(true);
    }
  }

  async function updateCommodity() {
    let resEnd = await fetch(
      `${baseUrl}/api/dataValues.json?de=${commodityId}&pe=${period}&ou=${orgUnit}&co=${endBID}`
    );
    let dataEnd = await resEnd.json();
    let newEndValue = (
      Number(dataEnd[0]) - Number(transaction.amount)
    ).toString();

    await fetch(
      `${baseUrl}/api/dataValues.json?de=${commodityId}&pe=${period}&ou=${orgUnit}&co=${endBID}&value=${newEndValue}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: null,
      }
    );

    let resCons = await fetch(
      `${baseUrl}/api/dataValues.json?de=${commodityId}&pe=${period}&ou=${orgUnit}&co=${consID}`
    );
    let dataCons = await resCons.json();
    let newConsValue = (
      Number(dataCons[0]) + Number(transaction.amount)
    ).toString();

    await fetch(
      `${baseUrl}/api/dataValues.json?de=${commodityId}&pe=${period}&ou=${orgUnit}&co=${consID}&value=${newConsValue}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: null,
      }
    );
  }

  return (
    <div>
      <h1>Commodity Dispensing</h1>

      <p>
        Below is a form to dispense a commodity. Under the form you can see a
        history of past dispenses.
      </p>
        <h2>Register new dispensing</h2>
        <Box width = '350px'>
        <Field label="Commodity">
          <SingleSelect
            onChange={(e) => setCommodityId(() => e.selected)}
            selected={commodityId}
            placeholder="Select a commodity"
          >
            {commodites.length > 0 &&
              commodites.map((commodity) => {
                return (
                  <SingleSelectOption
                    label={commodity.name}
                    value={commodity.id}
                  />
                );
              })}
          </SingleSelect>
        </Field>
        <Field label="Amount">
          <Input
            label="Amount"
            name="amount"
            type="number"
            onChange={(e) => handleInputFieldChange(e)}
          />
        </Field>
        <Field label="Dispensed By">
          <Input
            label="Dispensed By"
            name="dispensedBy"
            onChange={(e) => handleInputFieldChange(e)}
          />
        </Field>
        <Field label="Dispensed To">
          <Input
            label="Dispensed To"
            name="dispensedTo"
            onChange={(e) => handleInputFieldChange(e)}
          />
        </Field>
        <div className={classes.buttonPadding}>
          <Button onClick={handleNewTransaction} primary>
            Register
          </Button>
        </div>
      </Box>

      <Box>
        <h2>History</h2>
        <Table>
          <TableHead>
            <TableRowHead>
              <TableCellHead>Date</TableCellHead>
              <TableCellHead>Commodity</TableCellHead>
              <TableCellHead>Amount</TableCellHead>
              <TableCellHead>Dispensed By</TableCellHead>
              <TableCellHead>Dispensed To</TableCellHead>
            </TableRowHead>
          </TableHead>
          <TableBody>
            {transactions.length > 0 &&
              transactions.map((transaction) => {
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.dateTime}</TableCell>
                    <TableCell>{transaction.commodity}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.dispensedBy}</TableCell>
                    <TableCell>{transaction.dispensedTo}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Box>
      {updateComplete && (
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
            onHidden={() => setUpdateComplete(false)}
          >
            New dispensing completed.
          </AlertBar>
        </div>
      )}
    </div>
  );
}
