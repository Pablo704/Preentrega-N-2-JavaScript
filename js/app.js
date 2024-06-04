const form = document.getElementById("transactionForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    let transactionFormData = new FormData(form);
    const fecha = document.getElementById("fecha").value.trim();
    const monthYear = document.getElementById("monthyear").value.trim();
    const comment = document.getElementById("comment").value.trim();
    const ticket = document.getElementById("ticket").value.trim();
    const transaction = document.querySelector('input[name="stransaction"]:checked');
    const result = document.getElementById("result").value.trim();
    const equity = document.getElementById("equity").value.trim();

    // Validar que todos los campos obligatorios estén llenos
    if (fecha === "" || monthYear === "" || comment === "" || ticket === "" || !transaction || result === "" || equity === "") {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // Validar el formato de la fecha
    if (!/^\d+$/.test(fecha)) {
      alert("Por favor, ingrese una fecha válida.");
      return;
    }

    // Validar el formato de Mes-Año
    if (!/^\d{5}$/.test(monthYear)) {
      alert("Por favor, ingrese un Mes-Año válido (Ej: 62024).");
      return;
    }
    let transactionObj = convertFormDataToTransactionObject(transactionFormData);
    saveTransactionObj(transactionObj);
    insertRowInTransactionTable(transactionObj);
    form.reset();
});

document.addEventListener("DOMContentLoaded", function(event){
    let transactionObjArry = JSON.parse(localStorage.getItem("transactionData"));
    if (transactionObjArry) {
        transactionObjArry.forEach(
            function(transactionElement){
                insertRowInTransactionTable(transactionElement);
            }
        );
    }
});

function getNewTransactionId(){
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
    let newtransactionId = JSON.parse(lastTransactionId) + 1;
    localStorage.setItem("lastTransactionId" , JSON.stringify(newtransactionId));
    return newtransactionId;
}


function convertFormDataToTransactionObject(transactionFormData) {
    let comment = transactionFormData.get("comment");
    let date = transactionFormData.get("date");
    let monthyear = transactionFormData.get("monthyear");
    let ticket = transactionFormData.get("ticket");
    let stransaction = transactionFormData.get("stransaction");
    let result = transactionFormData.get("result");
    let equity = transactionFormData.get("equity");  
    let transactionId = getNewTransactionId();
    return {
        "comment":comment,
        "date": date,
        "monthyear": monthyear,
        "ticket": ticket,
        "stransaction": stransaction,
        "result": result,
        "equity": equity,
        "transactionId": transactionId
    };
}

function insertRowInTransactionTable(transactionObj) {
    let transactionTableRef = document.getElementById("transactiontable");

    let newtransactionRow = transactionTableRef.insertRow(-1);
    newtransactionRow.setAttribute("data-transaction-id", transactionObj["transactionId"]);

    let newTypeCellRef = newtransactionRow.insertCell(0);
    newTypeCellRef.textContent = transactionObj.comment;

    newTypeCellRef = newtransactionRow.insertCell(1);
    newTypeCellRef.textContent = transactionObj.date;

    newTypeCellRef = newtransactionRow.insertCell(2);
    newTypeCellRef.textContent = transactionObj.monthyear;

    newTypeCellRef = newtransactionRow.insertCell(3);
    newTypeCellRef.textContent = transactionObj.ticket;

    newTypeCellRef = newtransactionRow.insertCell(4);
    newTypeCellRef.textContent = transactionObj.stransaction;

    newTypeCellRef = newtransactionRow.insertCell(5);
    newTypeCellRef.textContent = transactionObj.result;

    newTypeCellRef = newtransactionRow.insertCell(6);
    newTypeCellRef.textContent = transactionObj.equity;

    let newDeleteCell = newtransactionRow.insertCell(7);
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    newDeleteCell.appendChild(deleteButton);


    deleteButton.addEventListener("click", (event) => { 
        let transactionRowR = event.target.parentNode.parentNode;
        let transactionId = transactionRowR.getAttribute("data-transaction-id");
        transactionRowR.remove();
        deleteTransactionObj(transactionId);
    })
}
function deleteTransactionObj(transactionId){
    let transactionObjArry = JSON.parse(localStorage.getItem("transactionData"));
    let transactionIndexInArray = transactionObjArry.findIndex(element => element.transactionId === transactionId);
    transactionObjArry.splice(transactionIndexInArray, 1);
    let transactionArrayJSON = JSON.stringify(transactionObjArry);
        localStorage.setItem("transactionData", transactionArrayJSON);
}

function saveTransactionObj(transactionObj) {  
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
    myTransactionArray.push(transactionObj);
    let transactionArrayJSON = JSON.stringify(myTransactionArray);
    localStorage.setItem("transactionData", transactionArrayJSON);
}
