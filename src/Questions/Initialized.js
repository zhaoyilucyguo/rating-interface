import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { List, ListItem, Divider, AppBar, Button } from '@mui/material';
import { orange } from '@mui/material/colors';

const style = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
  };
export class Initialized extends Component {
  constructor(props){
    super(props);
    this.state = {
        handleChange: this.props.handleChange,
        prevStep: this.props.prevStep
    }
  }
  render() {
    const { prevStep, handleChange } = this.props;
    const theme = createTheme({
        status: {
          danger: orange[500],
        },
      });
    return (
      <ThemeProvider theme={theme}>
        <div>
            <AppBar title="Rating" />
            <h1>Was the movement initialized?</h1>
            <List sx={style} component="nav" aria-label="mailbox folders">
                <ListItem
                  onClick={handleChange('SegInitialized', 1)}
                >
                    Yes
                </ListItem>
                <Divider />
                <ListItem
                  onClick={handleChange('SegInitialized', 0)}
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

export default Initialized