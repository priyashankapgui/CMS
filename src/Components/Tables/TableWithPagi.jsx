import * as React from 'react';
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F5F3F3',
    color: '#0377A8',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    fontSize: 14
  },
  [`&.${tableCellClasses.body }`]: {
    fontSize: 13,
    fontFamily: 'Poppins',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#FAFAFF',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function TableWithPagi({ rows, columns, itemsPerPage = 5 }) {
  const [page, setPage] = React.useState(1);
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePagiPage = (event, value) => {
    // Do something with the value in this handler if needed
    console.log ('Value of Pagination:', value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <>
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
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'flex-end', // Align to the pagination right
          marginTop: '20px',
        }}
      >
        <Pagination
          count={Math.ceil(rows.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          size="medium" // Reduced pagination size
          siblingCount={0}
          boundaryCount={1}
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#B1ABAB', // Non-selected text color
              '&:hover': {
                backgroundColor: 'lightblue', // Change to your desired hover color
              },
              '&.Mui-selected': {
                backgroundColor: '#23A3DA', // Change to your desired selected color
                color: 'white', // Text color of selected item
                '&:hover': {
                  backgroundColor: 'lightblue', // Keep the same color on hover for selected item
                },
              },
            },
          }}
          onChangePagiPage={handlePagiPage} // Added onChangePagiPage
        />
      </Stack>
    </>
  );
}

export default TableWithPagi;
