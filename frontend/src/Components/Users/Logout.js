import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { IconButton, Typography } from "@material-ui/core";
import Cookies from "universal-cookie";

const useStyles = makeStyles((theme) => ({
  logoutContainer: {
    position: "absolute",
    right: "2%",
    display: "flex",
    alignItems: "center",
  },
  logoutIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Logout = () => {
  const classes = useStyles();
  const cookies = new Cookies();

  const handleLogout = () => {
    cookies.remove("token");
    cookies.remove("balance");
    cookies.remove("contact");
    cookies.remove("email");
    cookies.remove("userID");
    cookies.remove("username");
    window.location.replace("http://localhost:3000/login");
  };
  return (
    <div className={classes.logoutContainer}>
      <IconButton color="inherit" onClick={handleLogout}>
        <ExitToAppIcon className={classes.logoutIcon} />
      </IconButton>
      <Typography variant="body1" onClick={handleLogout}>
        Logout
      </Typography>
    </div>
  );
};

export default Logout;
