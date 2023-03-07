import React, { Component } from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { List, ListItem, Divider, AppBar, Button, Typography } from '@mui/material';
import { orange, blue } from '@mui/material/colors';

export class Time extends Component {
  constructor(props){
    super(props);
    this.state = {
      values: this.props.values,
        handleChange: this.props.handleChange,
        prevStep: this.props.prevStep
    }
  }
  render() {
    const { values, handleChange, prevStep } = this.props;
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
            {values.Types[values.Type]} was performed in {values.timeDurations[values.Types[values.Type]]} seconds. Is it within a reasonable amount of time?
            </Typography>
            <List component="nav" aria-label="mailbox folders">
                <ListItem 
                onClick={handleChange('Time', 0)}
                sx={{
                  '&:hover':{
                    boxShadow: `0px 0px 0px 2px ${alpha(theme.palette.success.main, 0.16)}`
                  }
                }}
                >
                    Yes
                </ListItem>
                <Divider />
                <ListItem 
                onClick={handleChange('Time', 1)}
                sx={{
                  '&:hover':{
                    boxShadow: `0px 0px 0px 2px ${alpha(theme.palette.success.main, 0.16)}`
                  }
                }}
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