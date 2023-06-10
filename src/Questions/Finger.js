import React, { Component } from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { List, ListItem, Divider, AppBar, Button, Typography } from '@mui/material';
import { orange, blue } from '@mui/material/colors';
import axios from 'axios';


export class Finger extends Component {
  constructor(props){
    super(props);
    this.state = {
        values: this.props.values,
        handleChange: this.props.handleChange,
        prevStep: this.props.prevStep,
        handleChange: this.props.handleChange,
        finger: undefined
    }
  }
  async componentDidMount() {
    await axios.get(`http://localhost:5000/Finger/`+this.state.values.TaskID)
    .then(res => {
      this.setState({ finger: res.data.definition });
    })
  }
  render() {
    const { values, handleChange, prevStep, finger } = this.state;
    const theme = createTheme();
     
    return (
      <ThemeProvider theme={theme}>
        <div>
            <AppBar title="Rating" />
            <Typography variant="h6" gutterBottom>
                  Was the Task performed using the right fingers: 
                  <Typography variant="h7" display="inline" style={{ backgroundColor: 'yellow' }}>
                     {finger}
                  </Typography>
                  ?
            </Typography>
            {/* <TextField
                hintText="Is the Task Completed?"
                floatingLabelText="Task Completed"
                onChange={handleChange('TaskIsCompleted')}
                defaultValue={values.TaskIsCompleted}
            /> */}
            <List component="nav" aria-label="mailbox folders">
                <ListItem 
                onClick={handleChange('finger', 0)}
                sx={{
                  '&:hover':{
                    boxShadow: `0px 0px 0px 2px ${alpha(theme.palette.success.main, 0.16)}`
                  }
                }}
                >
                    Yes
                </ListItem>
                <Divider />
                <ListItem 
                onClick={handleChange('finger', 1)}
                sx={{
                  '&:hover':{
                    boxShadow: `0px 0px 0px 2px ${alpha(theme.palette.success.main, 0.16)}`
                  }
                }}
                >
                    No
                </ListItem>
            </List>
            <Button
                label="Back"
                style={StyleSheet.button}
                onClick={()=>prevStep(values.IsCompleted === 1 ? 1 : 3)}
            >Back</Button>
        </div>
      </ThemeProvider>
    )
  }
}

export default Finger