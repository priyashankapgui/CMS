import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import UnAuthorized  from "../Components/Auth-Notification/Auth-Notificaion";


const SuperAdminRoute = () => {
    const [isLoggedIn, setIsLoggedIn] = useState();
    useEffect(() => {
    const verfiyToken = async () => {
      const token = sessionStorage.getItem("accessToken");
      console.log(token);
      if (token) {
        const response = await fetch("http://localhost:8080/api/employees/verifySuperAdmin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch((error) => console.error("Error:", error));
        console.log(response);
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    verfiyToken();
    }
    , []);

  if(isLoggedIn === undefined){
    return null;
  }
  return isLoggedIn ? <Outlet /> : <UnAuthorized/>;
};

export default SuperAdminRoute;

