import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { List, ListItem, Divider, AppBar, Button } from '@mui/material';
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
            <h1>Did any of the movement quality elements important to the execution of the segment show a level of impairment that made the execution challenging?</h1>
            <List sx={style} component="nav" aria-label="mailbox folders">
                <ListItem
                  onClick={handleChange('Impaired', 1)}
                >
                    Yes
                </ListItem>
                <Divider />
                <ListItem
                  onClick={handleChange('Impaired', 0)}
                >
                    No
                </ListItem>
            </List>
            <Button
                label="Back"
                style={StyleSheet.button}
                onClick={()=>prevStep(values.Type === 1 ? 1 : 2)}
            >Back</Button>
        </div>
      </ThemeProvider>
    )
  }
}

export default Impaired