import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { List, ListItem, Divider, AppBar } from '@mui/material';
import { orange, blue } from '@mui/material/colors';

export class Completed extends Component {
  constructor(props){
    super(props);
    this.state = {
        values: this.props.values,
        handleChange: this.props.handleChange
    }
  }
  render() {
    const { values, handleChange } = this.state;
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
            <h1>Was the {values.Types[values.Type]} performed fully?</h1>
            {/* <TextField
                hintText="Is the Task Completed?"
                floatingLabelText="Task Completed"
                onChange={handleChange('TaskIsCompleted')}
                defaultValue={values.TaskIsCompleted}
            /> */}
            <List component="nav" aria-label="mailbox folders">
                <ListItem 
                onClick={handleChange('Completed', 1)}
                >
                    Yes
                </ListItem>
                <Divider />
                <ListItem 
                onClick={handleChange('Completed', 0)}
                >
                    No
                </ListItem>
            </List>
            
        </div>
      </ThemeProvider>
    )
  }
}

export default Completed