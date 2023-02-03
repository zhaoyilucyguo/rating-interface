import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Button } from '@mui/material';
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
            <h1>Score for {values.Types[values.Type]} is {values.Rating}</h1>
            <h1>Now move on to the next segment</h1>
            
            <Button
                label="Back"
                style={StyleSheet.button}
                onClick={()=>
                  prevStep(
                    values.Type === 1 ? 
                    values.Initialized === 1 ? 5 : 3 : 
                    values.Initialized === 1 ? 5 : 4)}
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