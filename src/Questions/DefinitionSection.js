import React, { useState } from 'react';
// import { Button, Collapse } from '@mui/core';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';


function DefinitionSection(props) {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div>
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}> */}
        <Button onClick={handleToggle}>
          {showDetails ? 'Hide Definition' : 'Show Definition'}
        </Button>
      {/* </Box> */}
      <Collapse in={showDetails}>
        <div>
          {/* Details content goes here */}
          {props.segment}: {JSON.parse(localStorage.getItem('definitions'))[props.segment]}
        </div>
      </Collapse>
    </div>
  );
}

export default DefinitionSection;
