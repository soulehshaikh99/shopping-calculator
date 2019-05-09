import {Toolbar, Typography, withStyles} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
        userSelect: "none"
    },
    spacer: {
        flex: '1 1 100%',
    },
    title: {
        flex: '0 0 auto',
    },
});

let StatusBar = props => {
    const { classes, calculateTotalSum } = props;

    return (
        <Toolbar className={classes.root}>
            <div className={classes.title}>
                <Typography variant="subtitle1">
                    Grand Total : {parseFloat(`${calculateTotalSum}`).toFixed(2)}
                </Typography>
            </div>
            <div className={classes.spacer} />
            <div />
        </Toolbar>
    );
};

StatusBar.propTypes = {
    classes: PropTypes.object.isRequired,
    calculateTotalSum: PropTypes.number.isRequired
};

export default withStyles(toolbarStyles)(StatusBar);