import React, { Component } from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { List, ListItem, Divider, AppBar, Button, Typography } from '@mui/material';
import { orange } from '@mui/material/colors';

const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
  };
export class Impaired extends Component {
  constructor(props){
    super(props);
    this.state = {
        values: this.props.values,
        handleChange: this.props.handleChange,
        prevStep: this.props.prevStep
    }
  }
  render() {
    const { prevStep, handleChange, values } = this.props;
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
            Did the movement show any impairment?
            </Typography>
            <List sx={style} component="nav" aria-label="mailbox folders">
                <ListItem
                  onClick={handleChange('IsImpaired', 1)}
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
                  onClick={handleChange('IsImpaired', 0)}
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
                onClick={()=>prevStep(2)}
            >Back</Button>
        </div>
      </ThemeProvider>
    )
  }
}

export default Impaired