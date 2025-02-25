import React from "react";
import { yyyy } from "../utils";
import {
  Box,
  Button,
  ButtonStrip,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Table,
  TableHead,
  TableCellHead,
  TableBody,
  TableRow,
  TableRowHead,
  TableCell,
} from "@dhis2/ui";

let mapMonth = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "October",
  11: "November",
  12: "December",
};

export function StockBalanceHistoryModal(props) {
  let history = props.log.map((period) => [
    mapMonth[period[0].substring(4)],
    period[1],
  ]);
  return (
    <div>
      <Modal fluid>
        <ModalTitle>
          End Balance History for {props.name} year {yyyy}
        </ModalTitle>
        <ModalContent>
          <Box width="550px">
            <Table>
              <TableHead>
                <TableRowHead>
                  <TableCellHead>Month</TableCellHead>
                  <TableCellHead>End Balance</TableCellHead>
                </TableRowHead>
              </TableHead>
              <TableBody>
                {history.map((row) => {
                  return (
                    <TableRow key={Math.random()}>
                      <TableCell>{row[0]}</TableCell>
                      <TableCell>{row[1]}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </ModalContent>
        <ModalActions>
          <ButtonStrip end>
            <Button onClick={() => props.setShowModal(false)} secondary>
              Close
            </Button>
          </ButtonStrip>
        </ModalActions>
      </Modal>
    </div>
  );
}
