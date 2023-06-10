import React, { Component } from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { List, ListItem, Divider, AppBar, Typography } from '@mui/material';
import { orange, blue } from '@mui/material/colors';
import DefinitionSection from './DefinitionSection';


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
    const theme = createTheme();
     
    return (
      <ThemeProvider theme={theme}>
        <div>
            <AppBar title="Rating" />
            <Typography variant="h6" gutterBottom>
                  Was the {values.Types[values.Type]} performed fully?
            </Typography>
            {/* <TextField
                hintText="Is the Task Completed?"
                floatingLabelText="Task Completed"
                onChange={handleChange('TaskIsCompleted')}
                defaultValue={values.TaskIsCompleted}
            /> */}
            <List component="nav" aria-label="mailbox folders">
                <ListItem 
                onClick={handleChange('IsCompleted', 1)}
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
                onClick={handleChange('IsCompleted', 0)}
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

        </div>
      </ThemeProvider>
    )
  }
}

export default Completed