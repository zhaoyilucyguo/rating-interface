import React, { Component } from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { List, ListItem, Divider, AppBar, Button, Typography } from '@mui/material';
import { orange, blue } from '@mui/material/colors';
import DefinitionSection from './DefinitionSection';


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
            {values.Types[values.Type]} was performed in {JSON.parse(localStorage.getItem('timeDurations'))[values.Types[values.Type]]===undefined ? "0" : 
            JSON.parse(localStorage.getItem('timeDurations'))[values.Types[values.Type]].toFixed(3)} seconds. Is it within a reasonable amount of time?
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
            {values.Types[values.Type]!=="Task" ? <DefinitionSection segment={values.Types[values.Type]}/> : null}
            <Button
                label="Back"
                style={StyleSheet.button}
                onClick={()=>prevStep(
                  values.Types[values.Type]!=="Task" ? 
                  values.IsCompleted===1 ? 1 : 4 :
                  values.TaskID > 10 && values.TaskID < 17 ? 10 : 1
                  )}
            >Back</Button>
            
        </div>

      </ThemeProvider>
    )
  }
}

export default Time