let counter = 0;
let data = null;

const createData = (productName, noOfUnits, pricePerUnit, totalPrice) => {
    counter += 1;
    return { id: counter, productName, noOfUnits, pricePerUnit, totalPrice };
};

const desc = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

const stableSort = (array, cmp) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
};

const getSorting = (order, orderBy) => {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
};

const isInt = (n) => {
    return parseInt(n) === n;
};

const fillData = () => {
    data = localStorage.getItem("table-data");
    if (data)   {
        data = JSON.parse(data);
        return data;
    } else {
        return [];
    }
};

const fillTotalSum = () => {
    if (data) {
        let totalSum = 0;
        let idArray = [];
        data.forEach(value => {
            idArray.push(value.id);
            totalSum+=Number(value.totalPrice);
        });
        let largest = idArray[0] || 0;
        for (let number of idArray) {
            if (largest < number) {
                largest = number;
            }
        }
        counter = largest;
        return totalSum;
    } else {
        return 0;
    }
};

module.exports = {
    createData,
    getSorting,
    stableSort,
    fillData,
    fillTotalSum,
    isInt
};