# IN5320_g25.5

Case: https://www.uio.no/studier/emner/matnat/ifi/IN5320/h23/project/case-1/index.html

* Cato Stavenes 
* Daria Maria Popescu
* Jingwen Yu
* Johnny Nguyen
* Ole Larsen

## Functionality
- Home:
We wanted the home page to show the most critical aspects of the application. First, it shows commodities with low stock balance. Then the user gets to select a commodity, displaying its history for 2023.

- Stock Balance:
This page displays a table with the end balance for each commodity, along with the history. Clicking the history button on the right reveals the end balance to that specific commodity every month. Users can also easily search for a specific commodity within the table. 

- Consuption reporting:
This page allows the user the order a specific commodity. The user can write the quantity of the certain commodity to be ordered, and send the order by clicking on the 'Send order' button.
The user can also see the consumption and the end balance of each commodity. We have also added the functionality to search for a specific commodity.

- Commodity dispensing:
The commodity dispensing page is used to dispense a commodity. The user can choose a commodity, the amount and who it is dispensed to and by, and then register the commodity dispending by clicking on the 'Register' button. After registration the commodity appears under the history table down below. This table is displaying the dispensing history, showing the date, commodity, amount, who it was dispensed by, and to whom.

- Store management:
This page allows the user to restock all the commodities, by writing the amount the user wants to add. After writing the desired amount, the user can click on the 'Restock' button and the values will be displayed in a table down below as the history of transactions. The table down below shows a history of the transactions, displaying the commodity, the date and the old and new amount.

- Request commodities:
The request commodities page allows the user to select a clinic. After selecting a clinic, the page displays a table with the different commodities, the amount available of each commodety and the amount of that specific commodity the user wants to request. After the user is satisfied and has entered the desired amount to request, the user can click on the 'send request' button to send the request. 


## Implementation
- Home:
The home page takes in two requests, one for the history and one for the current data values. It uses the current data values to show a list of all commodities that have a value equal or less than 10. It uses the history to display the data for certain commodities over a period of 1 year (from the beginning of current year to current year and month). It is displayed on a line chart.

- Stock Balance:
The stock balance sheet page takes in the current data values, and displays them in a table, displaying commodity, stock balance and stock balance history. Stock balance uses the same data as the chart on the home page but displayed in a table instead of a line chart. The page displays commodities with a stock balance of less than 10 in red with (low stock) added after. The page also has a search function which searches, and filters on the commodity names.

- Consumption reporting:
This page makes one request and gets every commodity for our organization unit and its values for consumption, end balance and quantity to be ordered. This list is sorted by name. Above this table there is a search bar that searches on names using js' .include(). The "Send button" above opens a new conformation modal. Then, if the "confirm" button is clicked, this modal closes and a AlertBar is displayed at the bottom. If the "close" button is pressed, the modal will just close.

- Commodity dispensing:
Commodity dispensing loads all commodities from the dataSetElements endpoint, and loads all transactions from a custom dataStore. It maps over the commodities to improve the structure in addition to sorting them by name. A form is presented that has the fetched commodity names presented as a selection box. When registering a new dispensing requests are sent to get the current end balance and consumption for the chosen commodity. Post requests are then sent with the new calculated value. The custom dataStore (Dispensing_Log) holds an array with all transactions made. The array is replaced with a new version every time a new transaction is added, a choice we made to keep request count low.

- Store management:
The Store Management application, built using React and DHIS2 libraries, allows users to restock live-saving commodities. The system fetches commodity data from DHIS2, displays it in a user-friendly table, and enables users to restock by entering quantities. The transaction history is stored locally and in DHIS2, sorted by date. Success alerts provide feedback.

- Request commodities:
This page lists up all the nearby clinics of our own clinic (Blessed Mokaba East). The nearby clinics of our clinic is found under childrens of our parent clinic. When a nearby clinic is selected, this clinics ID is sent to the OrgUnitCommodities file. This file takes this id and make a new request to get every commodities of this clinic and its endbalances.


## Missing functionality/implementations, & things that do not work optimally
- More content on the home page
- Better user feedback, input validation
- Missing search bar on the request commodities page
- Modal clears form data when opened
