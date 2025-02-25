import React from "react";
import { useState } from "react";
import classes from "./App.module.css";
import { Navigation } from "./components/Navigation";
import { Home } from "./components/pages/Home";
import { StockBalance } from "./components/pages/StockBalance";
import { ConsumptionReporting } from "./components/pages/ConsumptionReporting";
import { CommodityDispensing } from "./components/pages/CommodityDispensing";
import { StoreManagement } from "./components/pages/StoreManagement";
import { RequestCommodities } from "./components/pages/RequestCommodities";

function MyApp() {
  const [activePage, setActivePage] = useState("Home");

  function activePageHandler(page) {
    setActivePage(page);
  }

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Navigation
          activePage={activePage}
          activePageHandler={activePageHandler}
        />
      </div>
      <div className={classes.right}>
        {activePage === "Home" && <Home />}
        {activePage === "Stock Balance" && <StockBalance />}
        {activePage === "Consumption reporting" && <ConsumptionReporting />}
        {activePage === "Commodity dispensing" && <CommodityDispensing />}
        {activePage === "Store Management" && <StoreManagement />}
        {activePage === "Request commodities" && <RequestCommodities />}
      </div>
    </div>
  );
}

export default MyApp;
