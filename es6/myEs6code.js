
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory);
  } else if (typeof exports === 'object') {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like enviroments that support module.exports,
      // like Node.
      module.exports = factory();
  } else {
      // Browser globals (root is window)
      root.Sparkline = factory();
}
}(this, function () {



function TableClass(){
   
    this.currencies = [];//Object of rowId & currency
    this.tableData = [];
    this.midPriceArray = [];
    this.exampleSparkline;
  
  
    this.addCurrency = function(currency) {
      this.currencies.push({
        'rowId': this.tableData.length,
        'currency': currency
      });
      return this.tableData.length;
    }
  
    this.renderTable = function() {
      this.tableData.sort((a, b) => {
        if (parseFloat(a.lastChangeBid) < parseFloat(b.lastChangeBid)) {
          return 1;
        } else {
          return -1
        }
      })
  
      let tBody = document.querySelector('table > tbody');
      while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
      }
      this.tableData.forEach((rowData) => {
        var row = document.createElement('tr');
        row.id = rowData.id;
  
        let rowItem;
  
        rowItem = document.createElement('td');
        rowItem.id = 'name';
        rowItem.innerText = rowData.name.toString();
        row.appendChild(rowItem);
  
        rowItem = document.createElement('td');
        rowItem.id = 'bestBid';
        rowItem.innerText = rowData.bestBid.toString();
        row.appendChild(rowItem);
  
        rowItem = document.createElement('td');
        rowItem.id = 'bestAsk';
        rowItem.innerText = rowData.bestAsk.toString();
        row.appendChild(rowItem);
  
        rowItem = document.createElement('td');
        rowItem.id = 'lastChangeAsk';
        rowItem.innerText = rowData.lastChangeAsk.toString();
        row.appendChild(rowItem);
  
        rowItem = document.createElement('td');
        rowItem.id = 'lastChangeBid';
        rowItem.innerText = rowData.lastChangeBid.toString();
        row.appendChild(rowItem);
  
        tBody.appendChild(row);
      })
    }
  
    this.renderRow = function(rowData) {
      try {
        let tBody = document.querySelector('table > tbody');
        var row = document.createElement('tr');
        row.id = rowData.id;
  
        let rowItem;
        rowItem = document.createElement('td');
        rowItem.id = 'name';
        rowItem.innerText = rowData.name.toString();
        row.appendChild(rowItem);
  
        rowItem = document.createElement('td');
        rowItem.id = 'bestBid';
        rowItem.innerText = rowData.bestBid.toString();
        row.appendChild(rowItem);
  
        rowItem = document.createElement('td');
        rowItem.id = 'bestAsk';
        rowItem.innerText = rowData.bestAsk.toString();
        row.appendChild(rowItem);
  
        rowItem = document.createElement('td');
        rowItem.id = 'lastChangeAsk';
        rowItem.innerText = rowData.lastChangeAsk.toString();
        row.appendChild(rowItem);
  
        rowItem = document.createElement('td');
        rowItem.id = 'lastChangeBid';
        rowItem.innerText = rowData.lastChangeBid.toString();
        row.appendChild(rowItem);
  
        tBody.appendChild(row);
  
      } catch (e) {
        console.log(e)
      }
    }
  
    this.pushTableRowAtIndex = function(index, currentRowData) {
      // index = 4 currentRowIndex=2
      let currentRowIndex;
      let localTableData = JSON.parse(JSON.stringify(this.tableData));
  
      for (let i = 0; i < localTableData.length; i++) {
        if (localTableData[i].id === currentRowData.id)
          currentRowIndex = i;
      }
  
      localTableData.splice(index, 0, currentRowData);
  
      if (index >= currentRowIndex) {
        //index remains same even after slicing
        localTableData.splice(currentRowIndex, 1);
      } else {
        //index changes by one
        localTableData.splice(currentRowIndex + 1, 1);
      }
      //update currentRow to its new index 
      this.tableData = localTableData;
  
    }
  
    this.pushIndex = function(currentRowData) {
      try {
        //calculate the index where the new element needs to be pushed
        if (this.tableData.length > 1) {
          let tBody = document.querySelector('table > tbody');
  
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].id != currentRowData.id && (parseFloat(this.tableData[i].lastChangeBid) < parseFloat(currentRowData.lastChangeBid)) || this.tableData.length === i) {
              if (this.tableData.length !== i) {
                //push it to its new index            
                let currentRowEle = document.querySelector(`tr[id='${currentRowData.id}']`);
                let pushBeforeRowEle = document.querySelector(`tr[id='${this.tableData[i].id}']`);
  
                tBody.insertBefore(currentRowEle, pushBeforeRowEle);
                // //change the table order as well
  
                this.pushTableRowAtIndex(i, currentRowData);
              } else {
                //push the element at the last 
                let currentRowEle = document.querySelector(`tr[id='${currentRowData.id}']`);
                tBody.appendChild(currentRowEle);
                // //change the table order as well
                this.pushTableRowAtIndex(i, currentRowData);
              }
              break;
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
  
    }
  
    this.createNewRow = function(currentRowData) {
      try {
        //push the new row
        let rowId = this.addCurrency(currentRowData.name);
        currentRowData.id = rowId;
        this.tableData.push(currentRowData);
        // this.renderRow(currentRowData);
        // this.pushIndex(currentRowData);
  
      } catch (e) {
        console.log(e);
      }
    }
  
    this.getRowId = function(key) {
      let rowId;
      this.currencies.forEach((ele) => {
        if (ele.currency === key)
          rowId = ele.rowId;
      })
      return rowId;
    }
  
    this.highlightItem= function(tRow) {
      tRow.classList.add('blink');
      setTimeout(function () {
        tRow.classList.remove('blink');
      }, 500);
    }
  
    this.updateRowItem= function(rowItem, value) {
      rowItem.innerText = value;
      this.highlightItem(rowItem);
    }
  
    this.updateTableRowData= function(newRowData) {
      let updateRowId;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].name === newRowData.name) {
          this.tableData[i].bestBid = newRowData.bestBid;
          this.tableData[i].bestAsk = newRowData.bestAsk;
          this.tableData[i].lastChangeAsk = newRowData.lastChangeAsk;
          this.tableData[i].lastChangeBid = newRowData.lastChangeBid;
          updateRowId = this.tableData[i].id;
          break;
        }
      }
      return this.tableData[updateRowId];
    }
  
    this.updateExistingRow= function(rowData) {
      rowData = this.updateTableRowData(rowData);
      let tRow = document.querySelector(`tr[id='${rowData.id}']`);
      if (tRow) {
        this.updateRowItem(tRow.querySelector('#name'), rowData.name);
        this.updateRowItem(tRow.querySelector('#bestBid'), rowData.bestBid);
        this.updateRowItem(tRow.querySelector('#bestAsk'), rowData.bestAsk);
        this.updateRowItem(tRow.querySelector('#lastChangeAsk'), rowData.lastChangeAsk);
        this.updateRowItem(tRow.querySelector('#lastChangeBid'), rowData.lastChangeBid);
      }
      // this.pushIndex(rowData);
  
    }
  
    this.checkIfAlreadyPresent= function(key) {
      try {
        let flag = false;
        this.currencies.forEach((ele) => {
          if (ele.currency === key) {
            flag = true
          }
        })
        return flag;
      } catch (e) {
        console.log(e);
      }
    }
  
    this.renderChart= function(){
      let exampleSparkline = document.getElementById('chart')
      Sparkline.draw(exampleSparkline, this.midPriceArray)
    }
  
    this.calculateMidPrice= function(){
      try{
        setInterval(()=>{
          let calculatedMidPrice = (this.tableData[0].bestBid + this.tableData[0].bestBid) / 2;
         
          if(this.midPriceArray.length > 30){
            this.midPriceArray.pop();
            this.midPriceArray.unshift(calculatedMidPrice);
          }else{
            this.midPriceArray.push(calculatedMidPrice);
          }
        },1000)
      }catch(e){
        console.log(e);
      }
    }
  
}


return TableClass;

}));