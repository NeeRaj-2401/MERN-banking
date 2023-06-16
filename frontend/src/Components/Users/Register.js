import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, TextField, Button } from "@material-ui/core";
import axios from "axios";
import swal from "sweetalert";

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

const Register = () => {
  const classes = useStyles();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:4040/users/register-user", { data })
      .then((res) => {
        if (res.status === 201) {
          swal(
            "User Registered Successfully",
            "Please Login with username and password",
            "success"
          ).then(() => window.location.replace("http://localhost:3000/login"));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container maxWidth="xs" className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Register
      </Typography>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          label="First Name"
          variant="outlined"
          name="firstName"
          value={data.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Last Name"
          variant="outlined"
          name="lastName"
          value={data.lastName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Username"
          variant="outlined"
          name="username"
          value={data.username}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          name="phoneNumber"
          value={data.phoneNumber}
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          name="password"
          value={data.password}
          onChange={handleChange}
          required
        />
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          {" "}
          Register{" "}
        </Button>
      </form>
      <br />
      <Typography variant="body1" className={classes.registerLink}>
        Already have an account?{" "}
        <a href="/login" style={{ cursor: "pointer" }} color="primary">
          Click here to login
        </a>
      </Typography>
    </Container>
  );
};

export default Register;
