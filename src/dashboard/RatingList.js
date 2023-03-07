import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import { Main } from './../components/Main';
function preventDefault(event) {
  event.preventDefault();
}

export default function RatingList(props) {
    const theme = createTheme();
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.message}
    </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Rating ID</TableCell>
            <TableCell>Patient ID</TableCell>
            <TableCell>Task ID</TableCell>
            <TableCell>Hand ID</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.done ? 
            props.ptht.filter(list => list.isSubmitted===true).map((row) => (
                <TableRow key={row.patientTaskHandMappingId} 
                onClick={() => { window.location.href = '/Rating'+row.patientTaskHandMappingId; }}sx={{
                    '&:hover':{
                      boxShadow: `0px 0px 0px 2px ${alpha(theme.palette.success.main, 0.16)}`
                    }
                  }}>
                <TableCell>{row.patientTaskHandMappingId}</TableCell>
                <TableCell>{row.patientTaskHandMapping.patientId}</TableCell>
                <TableCell>{row.patientTaskHandMapping.taskId}</TableCell>
                <TableCell>{row.patientTaskHandMapping.handId}</TableCell>
                <TableCell>
                        <ArrowForwardIcon color="green"/>
                </TableCell>
                </TableRow>
            )) :
            props.ptht.filter(list => list.isSubmitted===false).map((row) => (
                <TableRow key={row.patientTaskHandMappingId} 
                onClick={() => { window.location.href = '/Rating'+row.patientTaskHandMappingId; }}
                sx={{
                    '&:hover':{
                      boxShadow: `0px 0px 0px 2px ${alpha(theme.palette.success.main, 0.16)}`
                    }
                  }}>
                <TableCell>{row.patientTaskHandMappingId}</TableCell>
                <TableCell>{row.patientTaskHandMapping.patientId}</TableCell>
                <TableCell>{row.patientTaskHandMapping.taskId}</TableCell>
                <TableCell>{row.patientTaskHandMapping.handId}</TableCell>
                <TableCell>
                        <ArrowForwardIcon color="green"/>
                </TableCell>
                </TableRow>
            ))
          }
        </TableBody>
      </Table>
     
    </React.Fragment>
  );
}