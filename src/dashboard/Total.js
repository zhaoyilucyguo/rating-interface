import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export default function Total(props) {
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
      Total Ratings {props.showDone ? "Done" : "To Do"}
    </Typography>
      <Typography component="p" variant="h2">
        {props.number}
      </Typography>
      <div>
        <Button color="primary" onClick={()=>{props.changeList(props.showDone)}}>
          View Ratings
        </Button>
      </div>
    </React.Fragment>
  );
}