import React, {Component} from "react";
import {Checkbox, TableHead, TableRow, TableSortLabel, Tooltip} from "@material-ui/core";
import CustomTableCell from "./CustomTableCell";
import PropTypes from "prop-types";

const rows = [
    { id: 'productName', numeric: true, disablePadding: true, label: 'Product Name' },
    { id: 'noOfUnits', numeric: true, disablePadding: false, label: 'Units' },
    { id: 'pricePerUnit', numeric: true, disablePadding: false, label: 'Price / Unit' },
    { id: 'totalPrice', numeric: true, disablePadding: false, label: 'Total' }
];

class EnhancedTableHead extends Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        return (
            <TableHead>
                <TableRow>
                    <CustomTableCell padding="checkbox">
                        <Checkbox
                            style={{color:"white"}}
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}/>
                    </CustomTableCell>
                    {rows.map(
                        row => (
                            <CustomTableCell
                                key={row.id}
                                align="left"
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}>
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}>
                                    <TableSortLabel
                                        style={{color:"white"}}
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}>
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </CustomTableCell>
                        ),
                        this
                    )}
                    <CustomTableCell padding="checkbox"/>
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHead;