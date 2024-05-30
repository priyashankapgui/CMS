import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import UnAuthorized  from "../Components/Auth-Notification/Auth-Notificaion";

const ProtectedRoute = (groupName) => {
    const [isLoggedIn, setIsLoggedIn] = useState();
    useEffect(() => {
    const verfiyToken = async () => {
      const token = sessionStorage.getItem("accessToken");
    //   console.log({groupName, token});
      if (token) {
        const response = await fetch("http://localhost:8080/verifyPermissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            groupName: groupName.groupName
          })
        }).catch((error) => console.error("Error:", error));
        const data = await response.json();
        console.log(data);
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
    , [groupName]);
    if(isLoggedIn === undefined){
        console.log("Loading...");
        return null;
    }

  return isLoggedIn ? <Outlet /> : <UnAuthorized/>;
}

export default ProtectedRoute;