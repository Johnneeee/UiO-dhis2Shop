import React from "react";
import {
  IconAddCircle24,
  IconArchive24,
  IconTable24,
  IconUserGroup24,
  IconVisualizationColumn24,
  IconWorld24,
  Menu,
  MenuItem,
} from "@dhis2/ui";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        icon={<IconWorld24 />}
        label="Home"
        active={props.activePage == "Home"}
        onClick={() => props.activePageHandler("Home")}
      />
      <MenuItem
        icon={<IconTable24 />}
        label="Stock Balance"
        active={props.activePage == "Stock Balance"}
        onClick={() => props.activePageHandler("Stock Balance")}
      />
      <MenuItem
        icon={<IconVisualizationColumn24 />}
        label="Consumption reporting"
        active={props.activePage == "Consumption reporting"}
        onClick={() => props.activePageHandler("Consumption reporting")}
      />
      <MenuItem
        icon={<IconArchive24 />}
        label="Commodity dispensing"
        active={props.activePage == "Commodity dispensing"}
        onClick={() => props.activePageHandler("Commodity dispensing")}
      />
      <MenuItem
        icon={<IconAddCircle24 />}
        label="Store Management"
        active={props.activePage == "Store Management"}
        onClick={() => props.activePageHandler("Store Management")}
      />
      <MenuItem
        icon={<IconUserGroup24 />}
        label="Request commodities"
        active={props.activePage == "Request commodities"}
        onClick={() => props.activePageHandler("Request commodities")}
      />
    </Menu>
  );
}
