import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    },
    message: {
        textAlign: "center",
        color: "#000",
    },
}));

const AccessDenied = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography variant="h2" className={classes.message}>
                You are not allowed to access this page.
            </Typography>
        </div>
    );
};

export default AccessDenied;
