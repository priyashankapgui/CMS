import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F5F3F3',
    color: '#0377A8',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    fontSize: 14
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    fontFamily: 'Poppins',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#FAFAFF',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// TableWithPagi component
function TableWithPagi({ rows, columns, itemsPerPage = 5 }) {
  const [page, setPage] = useState(1);

  // Handlers
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculations
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <StyledTableCell key={index}>{column}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(startIndex, endIndex).map((row, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
                  <StyledTableCell key={cellIndex}>{cell}</StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'flex-end',
          marginTop: '20px',
        }}
      >
        <Pagination
          count={Math.ceil(rows.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          size="medium"
          siblingCount={0}
          boundaryCount={1}
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#B1ABAB',
              '&:hover': {
                backgroundColor: 'lightblue',
              },
              '&.Mui-selected': {
                backgroundColor: '#23A3DA',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'lightblue',
                },
              },
            },
          }}
        />
      </Stack>
    </>
  );
}

export default TableWithPagi;