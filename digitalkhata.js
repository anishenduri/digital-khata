let ledgerContainer = document.getElementById("ledgerContainer");
let addEntryButton = document.getElementById("addEntryButton");
let saveLedgerButton = document.getElementById("saveLedgerButton");

// Load from localStorage or empty array
function getLedgerFromLocalStorage() {
    let stringifiedLedger = localStorage.getItem("ledgerList");
    let parsedLedger = JSON.parse(stringifiedLedger);
    return parsedLedger === null ? [] : parsedLedger;
}

let ledgerList = getLedgerFromLocalStorage();
let entryCount = ledgerList.length;

// Reset save button text and style
function resetSaveButton() {
    saveLedgerButton.textContent = "Save Khata";
    saveLedgerButton.classList.remove("btn-secondary");
    saveLedgerButton.classList.add("btn-primary");
}

// Update balance summary
function updateSummary() {
    let totalGiven = 0;
    let totalReceived = 0;

    for (let entry of ledgerList) {
        if (entry.amount < 0) {
            totalGiven += Math.abs(entry.amount);
        } else {
            totalReceived += entry.amount;
        }
    }

    let net = totalReceived - totalGiven;

    document.getElementById("totalGiven").textContent = `Total Given: ₹${totalGiven}`;
    document.getElementById("totalReceived").textContent = `Total Received: ₹${totalReceived}`;
    document.getElementById("netBalance").textContent = `Net Balance: ₹${net}`;
}

// Save to localStorage
saveLedgerButton.onclick = function() {
    localStorage.setItem("ledgerList", JSON.stringify(ledgerList));
    saveLedgerButton.textContent = "Saved ✅";
    saveLedgerButton.classList.remove("btn-primary");
    saveLedgerButton.classList.add("btn-secondary");
};

// Handle Add Entry
function onAddEntry() {
    let name = document.getElementById("nameInput").value.trim();
    let amount = document.getElementById("amountInput").value.trim();
    let date = document.getElementById("dateInput").value;

    if (name === "" || amount === "" || date === "") {
        alert("Please fill all fields.");
        return;
    }

    entryCount++;
    let newEntry = {
        id: entryCount,
        name: name,
        amount: parseFloat(amount),
        date: date
    };

    ledgerList.push(newEntry);
    createAndAppendEntry(newEntry);
    resetSaveButton();
    updateSummary();

    document.getElementById("nameInput").value = "";
    document.getElementById("amountInput").value = "";
    document.getElementById("dateInput").value = "";
}

addEntryButton.onclick = function() {
    onAddEntry();
};

// Handle Delete Entry
function onDeleteEntry(entryId) {
    let entryElement = document.getElementById("entry" + entryId);
    ledgerContainer.removeChild(entryElement);

    let index = ledgerList.findIndex(entry => entry.id === entryId);
    if (index !== -1) ledgerList.splice(index, 1);

    resetSaveButton();
    updateSummary();
}

// Render Entry in UI
function createAndAppendEntry(entry) {
    let entryId = "entry" + entry.id;

    let entryElement = document.createElement("li");
    entryElement.id = entryId;
    entryElement.classList.add("todo-item-container", "d-flex", "justify-content-between", "align-items-center");

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container");

    let nameLine = document.createElement("span");
    nameLine.textContent = `👤 ${entry.name}`;
    nameLine.classList.add("checkbox-label");

    let amountLine = document.createElement("span");
    amountLine.textContent = `💰 ₹${entry.amount}`;
    amountLine.classList.add("checkbox-label");

    let dateLine = document.createElement("span");
    dateLine.textContent = `📅 ${entry.date}`;
    dateLine.classList.add("checkbox-label");

    labelContainer.appendChild(nameLine);
    labelContainer.appendChild(amountLine);
    labelContainer.appendChild(dateLine);

    // Red "Delete" button instead of icon
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-sm", "btn-danger", "ml-3");
    deleteButton.onclick = function() {
        onDeleteEntry(entry.id);
    };

    entryElement.appendChild(labelContainer);
    entryElement.appendChild(deleteButton);
    ledgerContainer.appendChild(entryElement);
}

// On Page Load: Load saved entries and update summary
for (let entry of ledgerList) {
    createAndAppendEntry(entry);
}
updateSummary();