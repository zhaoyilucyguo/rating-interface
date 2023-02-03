import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { List, ListItem, Divider, AppBar, Button } from '@mui/material';
import { orange, blue } from '@mui/material/colors';

export class Time extends Component {
  constructor(props){
    super(props);
    this.state = {
        handleChange: this.props.handleChange,
        prevStep: this.props.prevStep
    }
  }
  render() {
    const { handleChange, prevStep } = this.props;
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
            <h1>Was the segment performed within a reasonable amount of time?</h1>
            <List component="nav" aria-label="mailbox folders">
                <ListItem 
                onClick={handleChange('Time', 0)}
                >
                    Yes
                </ListItem>
                <Divider />
                <ListItem 
                onClick={handleChange('Time', 1)}
                >
                    No
                </ListItem>
            </List>
            <Button
                label="Back"
                style={StyleSheet.button}
                onClick={()=>prevStep(1)}
            >Back</Button>
            
        </div>
      </ThemeProvider>
    )
  }
}

export default Time