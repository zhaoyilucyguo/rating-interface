import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Button, Typography } from '@mui/material';
import { orange, blue } from '@mui/material/colors';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Toolbar from '@mui/material/Toolbar';

export class Success extends Component {
    
  constructor(props){
    super(props);
    this.state = {
        prevStep: this.props.prevStep
    }
  }
  onTrigger = (input1, input2) => {
    this.props.parentCallback(input1, input2);
    // event.preventDefault();
  }
  render() {
    const { prevStep } = this.props;
    const theme = createTheme({
        status: {
          danger: orange[500],
        },
        palette: {
            primary: blue,
          },
      });
    return (
      <ThemeProvider theme={theme}>
        <div>
            <AppBar title="Rating" />
            <Typography variant="h6" gutterBottom>
            You have successfully finished the rating for this task!
            </Typography>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Button
                  label="Back"
                  style={StyleSheet.button}
                  onClick={()=>prevStep(7)}
              >Back</Button>
              <Button
                  style={StyleSheet.button}
                  onClick={()=>{
                    this.onTrigger("firstTask", 0);
                    this.onTrigger("Type", 1);
                    this.onTrigger("step", 1);
                  }}
              ><RestartAltIcon/></Button>
            </Toolbar>
        </div>
      </ThemeProvider>
    )
  }
}

export default Success