import {withStyles} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";

const CustomTableCell = withStyles(theme => ({
    head: {
        userSelect: "none",
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
        fontSize: 16,
    },
    body: {
        userSelect: "none",
        fontSize: 14,
    }
}))(TableCell);

export default CustomTableCell;