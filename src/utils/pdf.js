/*
const jsPDF = require('jspdf');
require('jspdf-autotable');

const data = [
    {
        "id": 3,
        "productName": "Glucobay M50",
        "noOfUnits": 4,
        "pricePerUnit": 141,
        "totalPrice": 564
    },
    {
        "id": 4,
        "productName": "Aciloc RD",
        "noOfUnits": 3,
        "pricePerUnit": 35.5,
        "totalPrice": "106.50"
    },
    {
        "id": 5,
        "productName": "Rosuvas",
        "noOfUnits": 3,
        "pricePerUnit": 280,
        "totalPrice": 840
    }
];

const columns = [
    {title: "Product Name", dataKey: "productName"},
    {title: "No. Of Units", dataKey: "noOfUnits"},
    {title: "Price Per Unit", dataKey: "pricePerUnit"},
    {title: "Total Price", dataKey: "totalPrice"}
];
const rows = [];
for (let dt of data) {
    rows.push({
        productName: dt.productName,
        noOfUnits: dt.noOfUnits,
        pricePerUnit: dt.pricePerUnit,
        totalPrice: dt.totalPrice
    })
}

const doc = new jsPDF();
doc.autoTable(columns, rows, {
    theme:'grid',
    styles: {fillColor: [48,63,159]},
    columnStyles: {
        id: {fillColor: 255}
    },
    margin: {top: 5}
});
doc.save('table.pdf');*/
