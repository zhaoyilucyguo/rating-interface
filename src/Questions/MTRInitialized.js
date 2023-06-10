import React, { Component } from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { List, ListItem, Divider, AppBar, Button, Typography } from '@mui/material';
import { orange } from '@mui/material/colors';
import DefinitionSection from './DefinitionSection';


const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
  };
export class MTRInitialized extends Component {
  constructor(props){
    super(props);
    this.state = {
      values: this.props.values,
        handleChange: this.props.handleChange,
        prevStep: this.props.prevStep
    }
  }
  render() {
    const { handleChange, prevStep, values } = this.state;
    // const { values, handleChange } = this.props;
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
             {values.TaskID > 16 ? "Was 50% of GIP completed?" : "Was MTR initialized?"} 
            </Typography>
            <List sx={style} component="nav" aria-label="mailbox folders">
                <ListItem
                onClick={handleChange('SegInitialized', 1)}
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
                  onClick={handleChange('SegInitialized', 0)}
                  sx={{
                    '&:hover':{
                      boxShadow: `0px 0px 0px 2px ${alpha(theme.palette.success.main, 0.16)}`
                    }
                  }}
                >
                    No
                </ListItem>
            </List>
            <DefinitionSection segment={values.TaskID > 16 ? "GIP" : "MTR"}/>
            <Button
                label="Back"
                style={StyleSheet.button}
                onClick={()=>prevStep(1)}
                // onClick={()=>{this.setState({step: 1})}}
            >Back</Button>
        </div>
      </ThemeProvider>
    )
  }
}

export default MTRInitialized