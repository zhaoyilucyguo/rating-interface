import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Button, Typography, ListItem, ListItemText } from '@mui/material';
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
            <Typography variant="h6" gutterBottom>
            Rating summary
            </Typography>
            {
              Object.keys(values.result)
              .map(res=>
                <ListItem key={res} sx={{ py: 1, px: 0 }}>
                  <ListItemText primary={res}/>
                  <Typography variant="body2">{values.result[res].Rating.substring(0, 1)}</Typography>
                </ListItem>
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