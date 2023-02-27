import React, {Component} from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { NavLink } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';


export class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      ptht: this.props.ptht,
      open: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    if (this.state.open === false){
      this.setState({anchorEl: event.currentTarget});
      this.setState({open: true});
    }
    else {
      this.handleClose();
    }
  }
  handleSignOut(){
    window.location.href = '/';
  }
  handleClose() {
    this.setState({anchorEl: null});
    this.setState({open: false});
    window.location.reload();
  }
  componentDidMount() {
    this.setState({
        ptht: this.props.ptht
    });
}
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.ptht !== prevProps.ptht) {
      this.componentDidMount();
    }
  }
  render(){
    var {anchorEl, open, ptht}=this.state;
    return (
      <div>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Button
              id="fade-button"
              aria-controls={open ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={
                    this.handleClick
              }
            >
            <Typography variant="h4" sx={{ paddingX: 5 }}>Arat Rating</Typography>
          </Button>
          <Button
            id="fade-button"
            aria-controls='fade-menu'
            aria-haspopup="true"
            aria-expanded='true'
            onClick={
                  this.handleSignOut
            }
          >
          <LogoutIcon style={{ flex: 1 }}/>
          </Button>
        </Toolbar>
          
        
        
        <Menu
          id="fade-menu"
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={()=>{
            this.setState({anchorEl: null});
            this.setState({open: false});
          }}
          TransitionComponent={Fade}
          PaperProps={{
            style: {
              height: '90%',
              width: '30%',
              // padding: 8,
              margin: "0px 0px 0px 50px"
            }
          }}
        >
          <MenuItem onClick={this.handleClose} key={"home"}>
            <NavLink to={"/home"} id={"home"} style={{ textDecoration: 'none' }}
            onClick={()=>{
              // this.handleClose();
            }}>
              <Typography>Home</Typography>
            </NavLink>
          </MenuItem>
          {
            ptht.map
            (
              list=>
              <MenuItem onClick={this.handleClose} key={"PTH"+list.patientTaskHandMappingId}>
                <NavLink to={'/Rating'+list.patientTaskHandMappingId} id={list.patientTaskHandMappingId} style={{ textDecoration: 'none' }}
                onClick={()=>{
                  // this.handleClose();
                }}>
                  <Typography>
                    Patient {list.patientTaskHandMapping.patientId},
                    Task {list.patientTaskHandMapping.taskId}, 
                    Hand {list.patientTaskHandMapping.handId}
                  </Typography>
                </NavLink>
              </MenuItem>
            )
          } 
        </Menu>
    </div>
    );
  }
}
export default Dropdown;

