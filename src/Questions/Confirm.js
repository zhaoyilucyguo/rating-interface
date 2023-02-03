import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Button } from '@mui/material';
import { orange, blue } from '@mui/material/colors';

export class Confirm extends Component {
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
            <h1>Confirm</h1>
            <h2>Task ID: {values.TaskID}</h2>
            {
              Object.keys(values.result)
              .map(res=>
                <div key={res}>
                  <p><b>Score for {res}</b></p>
                  {/* <p>
                    Does the patient complete this {res}? 
                    {" " + values.result[res].Completed==1 ? "Yes" : "No"}
                  </p>
                  <p>
                    {res == "Task" ? "Is M&TR initialized?" : "Is the movement initialized?"} 
                    {" " + values.result[res].Initialized == 1 ? "Yes" : values.result[res].Initialized == 0 ? "No" : "Undefined"}
                  </p>
                  <p>
                    Does the movement complete in time? 
                    {values.result[res].Time == 1 ? "No" : values.result[res].Time == 0 ? "Yes" : "Undefined"}
                  </p>
                  <p>
                    Does the movement shows any significant impairments?
                    {" " + values.result[res].Impaired == 1 ? "Yes" : values.result[res].Impaired == 0 ? "No" : "Undefined"}
                  </p>
                  <p>
                    What are the impairments?
                    {" " + values.result[res].Impairments}
                  </p> */}
                  <p>
                    {values.result[res].Rating.substring(0, 1)}
                  </p>
                </div>
              )
            }
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
            >Continue</Button>
        </div>
      </ThemeProvider>
    )
  }
}

export default Confirm