import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, TextField, Button } from "@material-ui/core";
import axios from "axios";
import Cookies from "universal-cookie";
import swal from "sweetalert";

const cookies = new Cookies();

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "10vh",
  },
  title: {
    marginBottom: "2rem",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  submitButton: {
    marginTop: "1rem",
  },
});

const Login = () => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:4040/users/login-user", { username, password })
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          const user = res.data.user;
          cookies.set("userID", user._id);
          cookies.set("username", user.username);
          cookies.set("balance", user.balance);
          cookies.set("email", user.email);
          cookies.set("contact", user.phoneNumber);
          cookies.set("token", res.data.accessToken);
          swal("Login Successful", "", "success").then(() => {
            if (user.username.includes("admin")) {
              window.location.replace("http://localhost:3000/view-all-users");
            } else {
              window.location.replace("http://localhost:3000/transactions");
            }
          });
        } else {
          swal("Error!", res.data.message, "error");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container maxWidth="xs" className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        {" "}
        Login{" "}
      </Typography>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          label="Username/Email"
          variant="outlined"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          {" "}
          Sign In{" "}
        </Button>
      </form>
      <br />
      <Typography variant="body1" className={classes.registerLink}>
        Don't have an account?{" "}
        <a href="/register" style={{ cursor: "pointer" }} color="primary">
          Click here to register
        </a>
      </Typography>
    </Container>
  );
};

export default Login;
