import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function checkCookiesExist() {
  const cookieNames = [
    "token",
    "balance",
    "contact",
    "email",
    "userID",
    "username",
  ];
  for (let i = 0; i < cookieNames.length; i++) {
    const cookieExists = document.cookie.includes(`${cookieNames[i]}=`);
    if (!cookieExists) {
      return false;
    }
  }
  return true;
}
const ProtectedRoute = ({ component: Component, path, ...rest }) => {
  const isAuthenticated = checkCookiesExist();
  if (!isAuthenticated) {
    cookies.remove("token");
    cookies.remove("balance");
    cookies.remove("contact");
    cookies.remove("email");
    cookies.remove("userID");
    cookies.remove("username");
    return <Navigate to="/login" replace />;
  }
  if (path === 'viewUsers' && cookies.get('username')) {
    const username = cookies.get('username');
    if ( username && (username.includes('admin') || username.includes('admin1') || username.includes('admin2') || username.includes('admin3'))) {
      return <Component {...rest} />;
    } else {
      return <Navigate to="/not-found" replace />;
    }
  }
  
  return <Component {...rest} />;
};

export default ProtectedRoute;

