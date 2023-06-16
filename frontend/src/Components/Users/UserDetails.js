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
import { Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";

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
  const { userId } = useParams();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);
  const [balance, setBalance] = useState("");

  const getBalance = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4040/users/get-user-balance",
        {
          userID: userId,
        }
      );
      setBalance(res.data.balance);
    } catch (err) {
      console.log(err);
    }
  };
  const fetch = async () => {
    await axios
      .post("http://localhost:4040/transactions/get-user-transaction", {
        userID: userId,
      })
      .then((res) => {
        setRows(res.data.transactions);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBalance();
    fetch();
    const interval = setInterval(() => {
      fetch();
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
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
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
      </Paper>
      <br />
      <br />
      <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>
        Current Balance: {balance}
      </Typography>
    </>
  );
}
