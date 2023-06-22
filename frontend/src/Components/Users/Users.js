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
import swal from "sweetalert";

const cookies = new Cookies();

const columns = [
  { id: "userId", label: "User ID", minWidth: 170 },
  { id: "accountNumber", label: "Account Number", minWidth: 100 },
  { id: "balance", label: "Balance", minWidth: 170 },
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

export default function AllUsers() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);

  const fetch = async () => {
    await axios
      .post("http://localhost:4040/users/get-all-users", {})
      .then((res) => {
        // Filter out rows where the username includes 'admin'
        const filteredRows = res.data.users.filter(
          (user) => !user.username.includes("admin")
        );
        setRows(filteredRows);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
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

  const handleUserIdClick = (userId) => {
    window.open(`/user/${userId}`, "_blank");
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
                      role="button"
                      tabIndex={-1}
                      key={row.code}
                      onClick={() => handleUserIdClick(row.userId)}
                      style={{ cursor: "pointer" }}
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
    </>
  );
}
