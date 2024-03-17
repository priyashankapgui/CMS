import Layout from "../../../Layout/Layout";
import './Accounts.css';
import { Link } from "react-router-dom";


export function Accounts() {
    return (
        <>
            <div className="accounts">
                <h4>Accounts</h4>
            </div>
            <Layout>
                <div className="linkDiv">
                    <Link className="link" to="/Users">Users</Link>
                    <Link className="link" to="/UserRoleMgmt">User Role Mgmt</Link>
                </div>
            
            </Layout>
        </>
  );
}
