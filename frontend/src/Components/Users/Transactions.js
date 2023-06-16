import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Cookies from "universal-cookie";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import swal from "sweetalert";

const cookies = new Cookies();

const columns = [
  { id: "transactionId", label: "TransactionID", minWidth: 170 },
  { id: "transactionType", label: "Transaction\u00a0Type", minWidth: 100 },
  {
    id: "amount",
    label: "Amount",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "balance",
    label: "Balance",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "2rem",
    width: "100%",
    [theme.breakpoints.up("lg")]: {
      width: "70%",
    },
    margin: "auto",
  },
  container: {
    maxHeight: 440,
  },
  depositAmount: {
    marginRight: theme.spacing(2),
  },
}));

export default function Transactions() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);
  const [openDepositDialog, setOpenDepositDialog] = useState(false);
  const [openWithdrawalDialog, setOpenWithdrawalDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [balance, setBalance] = useState(0.0);
  const [user, setUser] = useState({});

  const uid = cookies.get("userID");

  const handleOpenDepositDialog = () => {
    setOpenDepositDialog(true);
  };

  const handleCloseDepositDialog = () => {
    setOpenDepositDialog(false);
  };

  const handleDeposit = async () => {
    // Perform deposit logic here
    console.log("Deposit amount:", depositAmount);
    if (parseFloat(depositAmount) > 50000.0) {
      swal(
        "Deposit Limit is only 50k",
        "Please Deposit the money of amount less than 50k at a time",
        "warning"
      );
      return;
    }
    await axios
      .post("http://localhost:4040/users/deposit-money", {
        depositAmount,
        userID: uid,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          swal(
            "Money Successfully Deposit",
            "Please Refresh or wait for some seconds to update the balance",
            "success"
          );
          fetchTransactions();
          setBalance(res.data.balance);
        }
      })
      .catch((err) => console.log(err));
    setDepositAmount("");
    setOpenDepositDialog(false);
  };

  const handleOpenWithdrawalDialog = () => {
    setOpenWithdrawalDialog(true);
  };

  const handleCloseWithdrawalDialog = () => {
    setOpenWithdrawalDialog(false);
  };

  const handleWithdrawal = async () => {
    // Perform withdrawal logic here
    console.log("Withdrawal amount:", withdrawalAmount);
    if (parseFloat(withdrawalAmount) > 10000.0) {
      swal(
        "Withdrawal Limit is only 10k",
        "Please Withdraw the money of amount less than 10k at a time",
        "warning"
      );
      return;
    }
    if (parseInt(withdrawalAmount) > balance) {
      swal(
        "Insuffiecient Balance",
        "Withdrawal money should be less than cuurent balance",
        "error"
      );
      return;
    }
    await axios
      .post("http://localhost:4040/users/withdraw-money", {
        withdrawalAmount,
        userID: uid,
      })
      .then((res) => {
        if (res.status === 200) {
          swal(
            "Money Successfully Withdraw",
            "Please Refresh or wait for some seconds to update the balance",
            "success"
          );
          fetchTransactions();
          setBalance(res.data.balance);
        }
      })
      .catch((err) => console.log(err));
    setWithdrawalAmount("");
    setOpenWithdrawalDialog(false);
  };

  const getBalance = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4040/users/get-user-balance",
        {
          userID: uid,
        }
      );
      setBalance(parseFloat(res.data.balance));
    } catch (err) {
      console.log(err);
    }
  };
  const fetchTransactions = async () => {
    await axios
      .post("http://localhost:4040/transactions/get-user-transaction", {
        userID: uid,
      })
      .then((res) => {
        // setRows(res.data.transactions.reverse());
        setRows(res.data.transactions);
      })
      .catch((err) => console.log(err));
  };

  const getUserData = async () => {
    await axios
      .post("http://localhost:4040/users/get-user-data", { userID: uid })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBalance();
    fetchTransactions();
    getUserData();
    const interval = setInterval(() => {
      getBalance();
      fetchTransactions();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Paper className={classes.root}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <Typography variant="h6">User Information:</Typography>
            <Typography variant="body1">
              <b>Name:</b> {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1">
              <b>Email:</b> {user.email}
            </Typography>
            <Typography variant="body1">
              <b>Phone Number:</b> {user.phoneNumber}
            </Typography>
            <Typography variant="body1">
              <b>Account Number:</b> {user.accountNumber}
            </Typography>
          </div>

          <div style={{ marginLeft: "auto", marginTop: "10%" }}>
            <Typography variant="h6" gutterBottom>
              Current Balance: {balance}
            </Typography>
          </div>
        </div>
        <br />
      </Paper>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "10px",
          }}
        >
          <Button
            style={{ margin: "1rem", marginTop: "0rem" }}
            variant="contained"
            color="primary"
            onClick={handleOpenDepositDialog}
          >
            Deposit
          </Button>
          <Button
            style={{ margin: "1rem", marginTop: "0rem" }}
            variant="contained"
            color="secondary"
            onClick={handleOpenWithdrawalDialog}
          >
            Withdrawal
          </Button>
        </div>
        <Dialog
          open={openDepositDialog}
          onClose={handleCloseDepositDialog}
          aria-labelledby="deposit-dialog-title"
        >
          <DialogTitle id="deposit-dialog-title">Deposit</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">Balance: {balance}</Typography>
            <TextField
              autoFocus
              margin="dense"
              id="deposit-amount"
              label="Amount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDepositDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeposit} color="primary">
              Deposit
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openWithdrawalDialog}
          onClose={handleCloseWithdrawalDialog}
          aria-labelledby="withdrawal-dialog-title"
        >
          <DialogTitle id="withdrawal-dialog-title">Withdrawal</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">Balance: {balance}</Typography>
            <TextField
              autoFocus
              margin="dense"
              id="withdrawal-amount"
              label="Amount"
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseWithdrawalDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleWithdrawal} color="primary">
              Withdraw
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
      <br />
      <br />
      <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>
        Current Balance: {balance}
      </Typography>
    </>
  );
}
