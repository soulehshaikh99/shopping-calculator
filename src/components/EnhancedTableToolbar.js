import {lighten} from "@material-ui/core/styles/colorManipulator";
import { Grid, IconButton, Toolbar, Tooltip, Typography, withStyles } from "@material-ui/core";
import PropTypes from 'prop-types';
import classNames from "classnames";
import {Add, Delete, Print} from "@material-ui/icons";
import React from "react";

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
        userSelect: "none"
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
    grid_item: {
        paddingRight: theme.spacing.unit * 2
    }
});

let EnhancedTableToolbar = props => {
    const { numSelected, classes, onAddition, onDeletion, printPDF } = props;

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}>
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        Shopping List
                    </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete Item(s)" onClick={onDeletion}>
                        <IconButton aria-label="Delete Item(s)">
                            <Delete />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Grid container
                          direction="row"
                          justify="center"
                          alignItems="center">
                        <Grid className={classes.grid_item} item xs={12} sm={6}>
                            <Tooltip title="Print PDF" onClick={printPDF}>
                                <IconButton aria-label="Print PDF">
                                    <Print />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid className={classes.grid_item} item xs={12} sm={6}>
                            <Tooltip title="Add Item" onClick={onAddition}>
                                <IconButton aria-label="Add Item">
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                )}
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onAddition: PropTypes.func.isRequired,
    onDeletion: PropTypes.func.isRequired,
    printPDF: PropTypes.func.isRequired
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
