import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableRow,
    TablePagination,
    TextField,
    IconButton,
    Tooltip
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { Edit } from '@material-ui/icons';

import CustomTableCell from './CustomTableCell';
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import StatusBar from './StatusBar';
import { createData, isInt, stableSort, getSorting, fillData, fillTotalSum } from '../utils/utility';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const styles = theme => ({
    root: {
        width: '90%'
    },
    table: {
        minWidth: 800
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    textField: {
        margin: theme.spacing.unit,
        width: 250
    },
    noSelect: {
        userSelect: "none"
    }
});

class EntireLayout extends Component {
    state = {
        order: 'asc',
        orderBy: '',
        selected: [],
        data: fillData(),
        page: 0,
        rowsPerPage: 5,
        open: false,
        markedForDeletion: [],
        newItem: {},
        editItem : {},
        totalSum: fillTotalSum()
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        localStorage.setItem('table-data', JSON.stringify(nextState.data));
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleClose = () => {
        this.setState({ open: false, editItem: {} });
    };

    handleOk = () => {
        this.handleClose();
        let data = this.state.data;
        const newItem = this.state.newItem;
        const editItem = this.state.editItem;
        const productName = newItem.productName || editItem.productName || '';
        const noOfUnits = Number(newItem.noOfUnits) ||  Number(editItem.noOfUnits) || 0;
        const pricePerUnit = Number(newItem.pricePerUnit) || Number(editItem.pricePerUnit) || 0;
        let totalPrice = noOfUnits * pricePerUnit;
        totalPrice = (isInt(totalPrice)) ? totalPrice : parseFloat(`${totalPrice}`).toFixed(2);
        data = [...data, createData(productName.trim(), noOfUnits, pricePerUnit, totalPrice)];
        let totalSum = 0;
        data.forEach(value => totalSum+=Number(value.totalPrice));
        this.setState({
            data: data,
            totalSum: totalSum,
            newItem: {},
            editItem: {}
        });
    };

    handleAdditionOfItem = ()  => {
        this.setState({ open: true });
    };

    onHandleTextFieldChange = (event, key) => {
        const newItem = this.state.newItem;
        newItem[key]=event.target.value;
        this.setState({
            newItem : newItem
        });
    };

    handlePrintPDF = () => {
        const columns = [
            {title: "Product Name", dataKey: "productName"},
            {title: "No. Of Units", dataKey: "noOfUnits"},
            {title: "Price Per Unit", dataKey: "pricePerUnit"},
            {title: "Total Price", dataKey: "totalPrice"}
        ];
        const rows = [];
        let data = this.state.data;
        for (let dt of data) {
            rows.push({
                productName: dt.productName,
                noOfUnits: dt.noOfUnits,
                pricePerUnit: dt.pricePerUnit,
                totalPrice: dt.totalPrice
            });
        }
        rows.push({
            pricePerUnit: 'Grand Total : ',
            totalPrice: parseFloat(`${this.state.totalSum}`).toFixed(2)
        });
        const doc = new jsPDF();
        const textWidth = doc.getStringUnitWidth("Shopping List") * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const textOffset = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(textOffset, 12, "Shopping List");
        const totalPagesExp = "{total_pages_count_string}";
        doc.autoTable(columns, rows, {
            theme:'striped',
            showHead: 'everyPage',
            headStyles: {font:'helvetica', fillColor: [48,63,159], textColor:[255,255,255], overflow: 'linebreak', fontSize:12, cellPadding:4},
            bodyStyles: {font: 'helvetica', fillColor: [255,255,255], textColor:[75,75,75], overflow: 'linebreak', fontSize:11, cellPadding:4},
            startY:18,
            didDrawPage: function (data) {
                let str = `Page ${doc.internal.getNumberOfPages()} of ${totalPagesExp}`;
                doc.setFontSize(12);
                const pageSize = doc.internal.pageSize;
                const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                doc.text(str, data.settings.margin.left, pageHeight - 8);
            }
        });
        doc.putTotalPages(totalPagesExp);
        doc.save('table.pdf');
    };

    handleDeletion = () => {
        let array = this.state.markedForDeletion;
        let data = this.state.data;
        for (let arr of array)  {
            for (let i = 0; i < data.length; i++)    {
                if(data[i].id === arr.id) {
                    data = data.filter(value => value.id !== arr.id);
                    break;
                }
            }
        }
        let totalSum = 0;
        data.forEach(value => totalSum+=Number(value.totalPrice));
        this.setState({
            data : data,
            markedForDeletion: [],
            selected:[],
            totalSum: totalSum
        });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({
                selected: state.data.map(n => n.id),
                markedForDeletion: this.state.data
            }));
            return;
        }
        this.setState({
            selected: [],
            markedForDeletion: []
        });
    };

    handleClick = (event, item) => {
        let id = item.id;
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        let array = this.state.markedForDeletion;
        if(array.find(value => value.id === id))   {
            this.setState({
                markedForDeletion : array.filter(value => value.id !== id)
            });
        }
        else {
            array.push(item);
            this.setState({
                markedForDeletion : array
            });
        }
        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page, totalSum, editItem } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}>
                    <DialogTitle>Add Item</DialogTitle>
                    <DialogContent>
                        <TextField
                            required
                            autoFocus
                            onChange={event => this.onHandleTextFieldChange(event, 'productName')}
                            label="Product Name"
                            defaultValue={editItem.productName}
                            className={classes.textField}/><br/>
                        <TextField
                            required
                            onChange={event => this.onHandleTextFieldChange(event, 'noOfUnits')}
                            type="number"
                            label="No. Of Units"
                            defaultValue={editItem.noOfUnits}
                            className={classes.textField}/><br/>
                        <TextField
                            required
                            onChange={event => this.onHandleTextFieldChange(event, 'pricePerUnit')}
                            type="number"
                            label="Price Per Unit"
                            defaultValue={editItem.pricePerUnit}
                            className={classes.textField}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            CANCEL
                        </Button>
                        <Button onClick={this.handleOk} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    onAddition={this.handleAdditionOfItem}
                    onDeletion={this.handleDeletion}
                    printPDF={this.handlePrintPDF}/>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data.length}/>
                        <TableBody>
                            {stableSort(data, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const isSelected = this.isSelected(n.id);
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={n.id}
                                            selected={isSelected}>
                                            <CustomTableCell padding="checkbox">
                                                <Checkbox
                                                    onClick={event => this.handleClick(event, n)}
                                                    checked={isSelected} />
                                            </CustomTableCell>
                                            <CustomTableCell component="th" scope="row" padding="none" style={{width:"280px"}}>
                                                {n.productName}
                                            </CustomTableCell>
                                            <CustomTableCell>{n.noOfUnits}</CustomTableCell>
                                            <CustomTableCell>{n.pricePerUnit}</CustomTableCell>
                                            <CustomTableCell>{n.totalPrice}</CustomTableCell>
                                            <CustomTableCell>
                                                <Tooltip
                                                    title="Edit"
                                                    onClick={() => this.editTableData(n)}
                                                    placement="bottom-end"
                                                    enterDelay={300}>
                                                    <IconButton><Edit /></IconButton>
                                                </Tooltip>
                                            </CustomTableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <CustomTableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <StatusBar calculateTotalSum={totalSum}/>
                <TablePagination
                    className={classes.noSelect}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}/>
            </Paper>
        );
    }

    editTableData(n) {
        const id = n.id;
        const productName = n.productName;
        const noOfUnits = n.noOfUnits;
        const pricePerUnit = n.pricePerUnit;
        const editItem = {
            productName: productName,
            noOfUnits: noOfUnits,
            pricePerUnit: pricePerUnit
        };
        const data = this.state.data.filter(value => value.id !== id);
        this.setState({
            data: data,
            totalSum: this.state.totalSum-(noOfUnits*pricePerUnit),
            editItem: editItem
        });
        this.handleAdditionOfItem();
    }
}

EntireLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EntireLayout);
