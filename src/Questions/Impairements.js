import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Button, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { orange } from '@mui/material/colors';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';


export class Impaired extends Component {
  constructor(props){
    super(props);
    this.state = {
        prevStep: this.props.prevStep,
        nextStep: this.props.nextStep,
        handleChange: this.props.handleChange,
        values: this.props.values,
        impairment_lst: {
          'SEAFR': 'shoulder elevation, abduction, flexion & external rotation', 
          'TS': 'trunk stabilization', 
          'ROME': 'range of motion for elbow',
          'FPS': 'forearm pronation/supination',
          'WPAT': 'wrist position aligned to task',
          'HA': 'hand aperture',
          'DP': 'digit positioning',
          'DPO': 'digit positioning and orientation',
          'SAT': 'smoothness and accuracy in limb trajectory',
          'FPO': 'final placement of object as appropriate for the task',
          'DMR': 'digit movement during release',
          'THS': 'trunk & head stabilization',
          'PP': 'palmar positioning (for gross motor section)',
        },
        impairments: {
          2: ['SEAFR', 'TS', 'ROME', 'FPS'], //IP
          3: ['ROME', 'THS', 'FPS', 'SEAFR'], //"GIP",
          4: ['DPO', 'SAT', 'FPS', 'TS'], //M&TR
          5: ['SEAFR', 'FPS', 'PP'], //"GT",
          6: ['SEAFR', 'FPS', 'TS', 'WPAT'], //"TG",
          7: ['DPO', 'SAT', 'FPS', 'TS'], //M&TR_2
          8: ['FPO', 'DMR', 'FPS', 'TS'], // P&R
          10: ['WPAT', 'HA', 'DP'] //T
        },
    }
  }
  render() {
    const { handleChange, nextStep, prevStep, values } = this.props;
    const theme = createTheme({
        status: {
          danger: orange[500],
          
        },
      });
    return (
      <ThemeProvider theme={theme}>
        <div>
            <AppBar title="Rating" />
            <Typography variant="h6" gutterBottom>
            Please select the movement qualities that showed impaired from the list below:
            </Typography>
            <FormGroup>
            {
              this.state.impairments[values.Type]
              .map(impairment=>
                <FormControlLabel 
                key={impairment} 
                control={
                <Checkbox 
                onClick={handleChange('Impairments', impairment)}/>} 
                label={this.state.impairment_lst[impairment]} />
              )
            }
            </FormGroup>
           
            <Button
                label="Back"
                style={StyleSheet.button}
                onClick={()=>prevStep(5)}
            >Back</Button>
            <Button
                onClick={()=>nextStep()}
            >Continue</Button>
        </div>
      </ThemeProvider>
    )
  }
}

export default Impaired