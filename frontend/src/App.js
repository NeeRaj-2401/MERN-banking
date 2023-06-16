import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Users/Login";
import Register from "./Components/Users/Register";
import Transactions from "./Components/Users/Transactions";
import AllUsers from "./Components/Users/Users";
import UserDetails from "./Components/Users/UserDetails";
import Logout from "./Components/Users/Logout";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  const isRestrictedPath = (path) => {
    const restrictedPaths = ["/", "/login", "/register"];
    return restrictedPaths.includes(path);
  };

  return (
    <>
      {!isRestrictedPath(window.location.pathname) && <Logout />}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/transactions"
            element={<ProtectedRoute component={Transactions} />}
          />
          <Route
            path="/view-all-users"
            element={<ProtectedRoute component={AllUsers} />}
          />
          <Route
            path="/user/:userId"
            element={<ProtectedRoute component={UserDetails} />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
