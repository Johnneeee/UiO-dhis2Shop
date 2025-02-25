import React from "react";
import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { OrgUnitCommodities } from "../OrgUnitCommodities";
import classes from "../../App.module.css";
import { ConfirmationModal } from "../ConfirmationModal";
import { sortData } from "../../utils";

import {
  AlertBar,
  Box,
  Button,
  CircularLoader,
  SingleSelect,
  SingleSelectOption,
} from "@dhis2/ui";

const request = {
  request0: {
    resource: "/organisationUnits/C9uduqDZr9d", // orgUnit C9uduqDZr9d is parent of our orgUnit lPeZdUm9fD7
    params: {
      fields: ["children[id, displayName]"],
    },
  },
};

function sendOrder(order) {
  document.getElementsByName("requestValue").value = "";
  order(true);
}

export function RequestCommodities(props) {
  const { loading, error, data } = useDataQuery(request);
  const [orgUnitID, setOrgUnitID] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    let childOrgUnits = data.request0.children;
    let commodites = [];
    childOrgUnits.map((row) => {
      commodites.push([row["displayName"], row["id"]]);
    });
    commodites = sortData(commodites);
    return (
      <Box>
        <Box>
          <h1>Request Commodities</h1>
          <p>Below you can choose a organisation unit, that you can request commodities from.</p>
          <div className={classes.buttonPadding}>
            <Button primary onClick={() => setShowModal(true)}>
              Send request
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
                Request has been sent!
              </AlertBar>
            </div>
          )}
          {showModal && (
            <ConfirmationModal
              title="Request Confirmation"
              message="Do you want to send the request?"
              setShowModal={setShowModal}
              setOrderComplete={setOrderComplete}
              sendOrder={sendOrder}
            />
          )}
        </Box>
        <Box>
          <SingleSelect
            className="select"
            onChange={(e) => setOrgUnitID(() => e.selected)}
            selected={orgUnitID}
          >
            {commodites.map((row) => {
              return <SingleSelectOption label={row[0]} value={row[1]} />;
            })}
          </SingleSelect>
        </Box>
        <Box>
          <OrgUnitCommodities orgUnitID={orgUnitID}></OrgUnitCommodities>
        </Box>
      </Box>
    );
  }
}
