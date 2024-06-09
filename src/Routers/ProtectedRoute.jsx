import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import UnAuthorized  from "../Components/Auth-Notification/Auth-Notificaion";
import MainSpinner from "../Components/Spinner/MainSpinner/MainSpinner";

const ProtectedRoute = (groupName) => {
    const [giveAccess, setGiveAccess] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
    const verfiyToken = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("accessToken");
      // console.log({groupName, token});
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
          setGiveAccess(true);
        } else {
          setGiveAccess(false);
        }
      } else {
        setGiveAccess(false);
      }
      setLoading(false);
    };
    verfiyToken();
    }
    , [groupName]);
    if(giveAccess === undefined){
        console.log("Loading...");
        return null;
    }

  return loading ? <MainSpinner loading={loading}/> : (giveAccess ? <Outlet /> : <UnAuthorized/>);
}

export default ProtectedRoute;