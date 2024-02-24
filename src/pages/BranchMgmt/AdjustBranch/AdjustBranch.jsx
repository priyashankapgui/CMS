import Layout from "../../../Layout/Layout";
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import "./AdjustBranch.css";
import DeletePopup from "../../../Components/PopupsWindows/DeletePopup";
import Buttons from "../../../Components/Buttons/Buttons";
import { Label } from "@mui/icons-material";
import InputLabel from "../../../Components/Label/InputLabel";


function createData(Branch_ID, Branch_Name, Address, Email, Contact_No) {
    return { Branch_ID, Branch_Name, Address, Email, Contact_No };

}
const rows = [
    createData('B001', 'Kaluthara', '28, Galle Road, Kaluthara South', 'kaluthara@greenleaf.com', '0718645752'),
    createData('B002', 'Galle', '10, Karapitiya Road, Galle', 'galle@greenleaf.com', '0918736458')
];

export const AdjustBranch = () => {
    return (
        <>
            <div className="adjust-branch">
                <h4>Adjust Branch</h4>
            </div>
            <Layout>
            <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <Box className="tableOuter">
          <label className='topic'>Registered Branches</label>
          <Buttons type="submit" id="new-btn"  style={{ backgroundColor: "white", color: "#23A3DA" }}> New + </Buttons>
          <TableContainer component={Paper}>
      <Table className='table'>
        <TableHead className='tableHead'>
          <TableRow>
            <TableCell><InputLabel for="branchId" color="#0377A8">Branch ID</InputLabel></TableCell>
            <TableCell align="left"><InputLabel for="branchName" color="#0377A8">Branch Name</InputLabel></TableCell>
            <TableCell align="left"><InputLabel for="address" color="#0377A8">Address</InputLabel></TableCell>
            <TableCell align="left"><InputLabel for="email" color="#0377A8">Email</InputLabel></TableCell>
            <TableCell align="left"><InputLabel for="contactNo" color="#0377A8">Contact No</InputLabel></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody className='tableBody'>
          {rows.map((row) => (
            <TableRow key={row.Branch_ID} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.Branch_ID}
              </TableCell>
              <TableCell align="left">{row.Branch_Name}</TableCell>
              <TableCell align="left">{row.Address}</TableCell>
              <TableCell align="left">{row.Email}</TableCell>
              <TableCell align="left">{row.Contact_No}</TableCell>
              <TableCell align="left"><CiEdit /></TableCell>
              <TableCell align="left"><DeletePopup/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </Box>
      </Container>
    </React.Fragment>
            </Layout>


        </>
    );
};
