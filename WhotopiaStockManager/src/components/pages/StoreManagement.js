import React from "react";
import { useState } from "react";
import { useDataQuery } from '@dhis2/app-runtime'
import classes from "../../App.module.css";
import { useDataMutation } from "@dhis2/app-runtime";


import {
    AlertBar,
    Input,
    CircularLoader,
    Table,
    TableHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableRowHead,
    TableCell,
    Button
} from "@dhis2/ui";

const dataSet = "ULowA8V3ucd"; // Live Saving commodites
const orgUnit = "lPeZdUm9fD7"; // OrgUnit
const period = "202311";       // Period


const dataQuery = {
  dataSets: {
      resource: 'dataSets/ULowA8V3ucd',
      params: {
          fields: [
            'dataSetElements[dataElement[name,id,categoryCombo[categoryOptionCombos[name,id]],dataElementGroups[name, id]]]'
        ],
      },
  },
  dataValueSets: {
      resource: 'dataValueSets',
      params: {
          orgUnit: orgUnit,
          dataSet: dataSet,
          period: period,
      },
  },
}

const transactionQuery = {
  restockDataStoreData: {
    resource: "dataStore/IN5320-255/Restock_Log",
  },
};


const updateStoreMutation = {
    resource: 'dataValueSets',
    type: "create",
    dataSet: 'ULowA8V3ucd/dataSetElements',
    data: ({ value, dataElement, period, orgUnit }) => ({
        dataValues: [
            {
                categoryOptionCombo: "rQLFnNXXIL0",
                dataElement: dataElement,
                period: period,
                orgUnit: orgUnit,
                value: value,
            },
        ],
    }),
};


function mergeData(data) {
  /* */
  let categories = [];
  data.dataSets.dataSetElements.map((d) => {
      let mergeInnerData = d.dataElement.categoryCombo.categoryOptionCombos.map((c) => {
              let matchedValue = {};
              try {
                  matchedValue = data.dataValueSets.dataValues.find(
                      (dataValues) => {
                          if (dataValues.dataElement == d.dataElement.id) {
                              if (dataValues.categoryOptionCombo == c.id) {
                                  return true;
                              }
                          }
                      }
                  );
              } catch (error) {
                  matchedValue.value = 0;
              }

              return {
                  name: c.name,
                  id: c.id,
                  value: matchedValue ? matchedValue.value : 0,
                  
              };
          });
      d.dataElement.dataElementGroups.map((c) => {
          if (c.id !== "Svac1cNQhRS") {
              const category = categories.filter((e) => e.name === c.name);
              if (category.length === 0) {
                  categories.push({
                      name: c.name,
                      id: c.id,
                      commodities: [
                          {
                              name: d.dataElement.name,
                              id: d.dataElement.id,
                              values: mergeInnerData,
                          },
                      ],
                  });
              } else {
                  category[0].commodities.push({
                      name: d.dataElement.name,
                      id: d.dataElement.id,
                      values: mergeInnerData,
                  });
              }
          }
      });
  });
  return categories;
}


//helper function for comparing elements of mergedData
function compare(a, b) {
  if (a.name < b.name) {
      return -1;
  }
  if (a.name > b.name) {
      return 1;
  }
  return 0;
}


export function StoreManagement(props) {
    const { loading, error, data } = useDataQuery(dataQuery);
    const [inputValues, setInputValues] = useState({});
    const [updateStore] = useDataMutation(updateStoreMutation);
    
    const [updateComplete, setUpdateComplete] = useState(false);
    const [shouldShowAlert, setShouldShowAlert] = useState(false);
    
   
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const [transactions, setTransactions] = useState(storedTransactions);

    const { loading: transactionLoading, error: transactionError, data: transactionData, refetch: refetchTransactions } = useDataQuery(transactionQuery);

    React.useEffect(() => {
      console.log("updateComplete:", updateComplete);
      if (updateComplete) {
        setShouldShowAlert(true);
      }
    }, [updateComplete]);



    if (error || transactionError) {
      return <span>ERROR: {error.message}</span>
    }

    if (loading || transactionLoading) {
        return <CircularLoader large />
    }

    if(data){
      const mergedData = mergeData(data)
      mergedData.forEach((row) => {
        row.commodities.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      })
      
      mergedData.sort(compare)
      console.log(mergedData)
      console.log("DATASET", dataSet)


      const handleInputChange = (dataElementId, value) => {
        setInputValues({
            ...inputValues,
            [dataElementId]: value,
        });

      };

      function getDate() {
        let d = new Date();
        let sec = d.getSeconds();
        let min = d.getMinutes();
        let hour = d.getHours();
        let month = d.getMonth();
        let year = d.getFullYear();
        let date = d.getDate();
        return `${hour}:${min}:${sec} ${date}/${month}/${year}`;
      }


      function updateDataInStore(){
        let newInputValues = { ...inputValues }; // Create a new object based on the current inputValues
        let newTransactions = [...transactions];


        mergedData.forEach((row) => {
          row.commodities.forEach((rrow) => {
            const dataElementId = rrow.id;

            const restock = inputValues[dataElementId] || 0; // Get the user input value, default to 0

            
            const currentQuantity = rrow.values[2].value; /* Fetch the current quantity for this data element */

            
            // Calculate the new quantity
            const newQuantity = parseInt(currentQuantity) + parseInt(restock);

            const existingIndex = newTransactions.findIndex(
              (t) => t.id === dataElementId
            );
  

            if (currentQuantity != newQuantity){
              let transaction = {
                id: dataElementId,
                Commodity: rrow.name.split('-')[1],
                dateForCompare: new Date(),
                dateTime: getDate(),
                Old_Quantity: currentQuantity,
                New_Quantity: newQuantity
              };


              if (existingIndex !== -1) {
                newTransactions[existingIndex] = transaction;
              } else {
                newTransactions.unshift(transaction);
              }

              newTransactions.sort((a, b) => {
                const dateA = new Date(a.dateForCompare);
                const dateB = new Date(b.dateForCompare);
              
                return dateB - dateA;
              });

              if (newTransactions.length > 13) {
                newTransactions = newTransactions.slice(-13);
              }

              updateStore({
                  value: newQuantity,
                  dataElement: dataElementId,
                  period: period,
                  orgUnit: orgUnit,
              }).then(response => {
                  if (response.status === 'SUCCESS') {
                  } else {
                      console.error(response.message);
                  }
              });
            }

            newInputValues[dataElementId] = "";
          });
      });

      setInputValues(newInputValues);

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransactions),
      };
      
      fetch(
        "http://localhost:9999/api/dataStore/IN5320-255/Restock_Log",
        requestOptions
      ).then((res) => {
        console.log(res);
      });

      // Refetch transactions after updating
      setTransactions(newTransactions);
      refetchTransactions();

      localStorage.setItem('transactions', JSON.stringify(newTransactions));


      setUpdateComplete(true);

    }

      return (
          <div>
              <h1>Store Management</h1>
              <div className={classes.buttonPadding}>
              <Button primary onClick={updateDataInStore}>
                Restock
              </Button>
              </div>
              <Table>
                  <TableHead>
                      <TableRowHead>
                          <TableCellHead>Commodity</TableCellHead>
                          <TableCellHead>Amount to add</TableCellHead>
                      </TableRowHead>
                  </TableHead>
                  <TableBody>
                  {mergedData.map(row => {
                    return (
                      row.commodities.map(rrow =>{
                        return(
                        <TableRow key={rrow.id}>
                          <TableCell>{rrow.name.split('-')[1]}</TableCell>
                          <TableCell>
                            <Input
                                value={inputValues[rrow.id]}
                                type = {Number}
                            onChange={(e) => {
                                handleInputChange(rrow.id, e.value);
                            }}
                            ></Input>
                            </TableCell>
                            </TableRow>
                            )
                      }));
                  })}
                  </TableBody>
              </Table>

              {/* Transaction for updating */}
              {transactionData && (
                <div>
                  <h2> Transaction History</h2>
                  <Table>
                    <TableHead>
                      <TableRowHead>
                        <TableCellHead>Commodity</TableCellHead>
                        <TableCellHead>Date</TableCellHead>
                        <TableCellHead>Old Amount</TableCellHead>
                        <TableCellHead>New Amount</TableCellHead>
                      </TableRowHead>
                    </TableHead>
                    <TableBody>
                      {transactionData.restockDataStoreData.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.Commodity}</TableCell>
                          <TableCell>{transaction.dateTime}</TableCell>
                          <TableCell>{transaction.Old_Quantity}</TableCell>
                          <TableCell>{transaction.New_Quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {shouldShowAlert && (
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
              duration={2000}
              onHidden={() => {setUpdateComplete(false); setShouldShowAlert(false)}}
            >
              Restock successful
            </AlertBar>
          </div>
        )}      
        </div>

      );

  }
}