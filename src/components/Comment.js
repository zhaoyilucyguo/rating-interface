import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Typography, Container, Paper, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';



function Comment(props) {
  const [value, setValue] = React.useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    var data={}
    data.patientTaskHandMappingId = props.PatientTaskHandMappingId;
    // data.TaskId = props.TaskId;
    // data.PatientId = props.PatientId;
    // data.HandId = props.HandId;
    
    data.segmentId = props.SegmentId;
    if (props.Type === "Task") data.segmentId = 0;
    data.therapistId = parseInt(localStorage.getItem('therapistId'));
    data.comment = value;
    console.log(data);
    axios.post('http://localhost:5000/feedback/', data)
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.log(error)
    })
    setOpen(true);  
  };
  const handleClose = () => {
    setOpen(false);
    setValue("");
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center">
        Comment
        </Typography>
        <form onSubmit={handleSubmit}>
            <TextField
            label="Having trouble rating? Please enter your comment here."
            variant="outlined"
            // multiline
            // rows={value.split('\n').length}
            value={value}
            onChange={handleChange}
            style={{width: '100%'}}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit">
                    Submit
                </Button>
            </Box>
        </form> 
        </Paper> 
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Comment Submitted</DialogTitle>
          <DialogContent>
            <p>{value}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>       
    </Container>    
  );
}
export default Comment;

