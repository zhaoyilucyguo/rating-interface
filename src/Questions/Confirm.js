import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Button, Typography, ListItem, ListItemText } from '@mui/material';
import { orange, blue } from '@mui/material/colors';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


export class Confirm extends Component {
  constructor(props){
    super(props);
    this.state = {
        values: this.props.values,
        prevStep: this.props.prevStep,
        nextStep: this.props.nextStep,
        handleChange: this.props.handleChange
    }
  }
  onTrigger = (input1, input2) => {
    this.props.parentCallback(input1, input2);
    // event.preventDefault();
  }
  render() {
    const { values, prevStep, nextStep, handleChange } = this.state;
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
                  <Typography variant="body2">
                    {values.result[res] ? values.result[res].rating.substring(0, 1):null}
                    </Typography>
                </ListItem>
              )
            }
            {values.revisitTask === 1 && values.firstTask === 1 ? null :
            <Button
                onClick={handleChange('revisitTask', 1)}
            >Revisit Task</Button>}
            <Button
                  style={StyleSheet.button}
                  onClick={()=>{
                    this.onTrigger("firstTask", 0);
                    this.onTrigger("Type", 1);
                    this.onTrigger("step", 1);
            }}
              ><RestartAltIcon/>Restart</Button>
            <Button
                onClick={handleChange('revisitTask', 0)}
            >Confirm & Move On</Button>
            
        </div>
      </ThemeProvider>
    )
  }
}

export default Confirm