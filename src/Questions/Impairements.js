import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
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
        impairments: {
          2: ['shoulder elevation', 
          'shoulder flexion or abduction', 
          'trunk stabilization',
          'range of motion for elbow',
          'trunk sway, flexion and rotation',
          'forearm pronation/supination',
          'wrist position not aligned to task',
          'hand aperture',
          'digit positioning'
            ], //IPT
          3: [], //"GI",
          4: ['digit positioning and orientation',
          'smoothness and accuracy in limb trajectory',
          'forearm orientation (supination/pronation)',
          'trunk movement and position'
        ], //M&TR
          5: [], //"GP",
          6: [], //"TG",
          7: ['digit positioning and orientation',
          'smoothness and accuracy in limb trajectory',
          'forearm orientation (supination/pronation)',
          'trunk movement and position'
        ], //M&TR_2
          8: ['final placement of object',
          'digit movement during release',
          'limb orientation (pronation/supination) during placement and release',
          'trunk sway/rotation'
        ] // P&R
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
            <h1>Please select the movement qualities that showed impaired from the list below:</h1>
            <FormGroup>
            {
              this.state.impairments[values.Type]
              .map(impairment=>
                <FormControlLabel key={impairment} control={<Checkbox onClick={handleChange('Impairments', {impairment})}/>} label={impairment} />
              )
            }
              {/* <FormControlLabel control={<Checkbox onClick={handleChange('Impairments', 'Arm')}/>} label="Arm" />
              <FormControlLabel control={<Checkbox onClick={handleChange('Impairments', 'Shoulder')}/>} label="Shoulder" />
              <FormControlLabel control={<Checkbox onClick={handleChange('Impairments', 'Hand')}/>} label="Hand" /> */}
            </FormGroup>k
           
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