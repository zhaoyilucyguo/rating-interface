import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Button } from '@mui/material';
import { orange, blue } from '@mui/material/colors';

export class Success extends Component {
    
  constructor(props){
    super(props);
    this.state = {
        prevStep: this.props.prevStep
    }
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
            <h1>You have successfully finished the rating for this task!</h1>
            
            <Button
                label="Back"
                style={StyleSheet.button}
                onClick={()=>prevStep(7)}
            >Back</Button>
        </div>
      </ThemeProvider>
    )
  }
}

export default Success