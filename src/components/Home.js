import React, {Component} from 'react';
import { render } from '@testing-library/react';
import { Typography } from '@mui/material';
  
export class Home extends Component {
  render(){
    return (
      <div>
        <Typography variant="h5" sx={{ paddingX: 8 }}>Welcome to Arat Rating!</Typography>

      </div>
    );
  }
  
};
  
export default Home;