import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Button, Typography } from '@mui/material';
import { orange, blue } from '@mui/material/colors';

export class NextSeg extends Component {
  constructor(props){
    super(props);
    this.state = {
        values: this.props.values,
        prevStep: this.props.prevStep,
        nextStep: this.props.nextStep,
    }
  }
  render() {
    const { values, prevStep, nextStep } = this.state;
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
            Score for {values.Types[values.Type]} is {values.Rating.substring(0, 1)}
            </Typography>
            <Typography variant="h6" gutterBottom>
            Now move on to {values.Types[values.nType]}
            </Typography>
            <Button
                label="Back"
                style={StyleSheet.button}
                onClick={()=>
                  prevStep(
                    values.Type === 1 ? 
                    values.IsCompleted === 1 ? 5 : 3 : 
                    values.IsCompleted === 1 ? values.IsImpaired === 1 ? 6 : 5 : 4)}
            >Back</Button>
            <Button
                onClick={()=>nextStep()}
            >Confirm & Continue</Button>
        </div>
      </ThemeProvider>
    )
  }
}

export default NextSeg