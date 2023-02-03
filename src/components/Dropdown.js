import React, {Component} from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { Route, Routes, BrowserRouter, NavLink } from "react-router-dom";


export class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      pth: this.props.pth,
      open: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClick(event: React.MouseEvent<HTMLElement>) {
    this.setState({anchorEl: event.currentTarget});
    this.setState({open: true});
    console.log(event.detail);
    if (event.detail == 2) window.location.href = '/';
  }
  handleClose() {
    // this.setState({anchorEl: null});
    this.setState({open: false});
    window.location.reload();
  }
  componentDidMount() {
    this.setState({
        pth: this.props.pth
    });
}
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.pth !== prevProps.pth) {
      this.componentDidMount();
    }
  }
  render(){
    var {anchorEl, open, pth}=this.state;
    return (
      <div>
        <Button
          id="fade-button"
          aria-controls={open ? 'fade-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={
            // (e)=>{
            // switch (e.detail) {
            //   case 1: // single click: open dropdown menu
                this.handleClick//();
          //       break;
          //     case 2: // double click: go to homepage
          //       window.location.href = '/';
          //       break;
          //   }
          // }
          }
        >
          <h1>Arat Rating</h1>
        </Button>
        <Menu
          id="fade-menu"
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Fade}
          PaperProps={{
            style: {
              height: '90%',
              width: '30%'
            }
          }}
        >
          <MenuItem onClick={this.handleClose} key={"home"}>
            <NavLink to={"/"} id={"home"} onClick={()=>{
              this.handleClose();
            }}>
              <h2>Home</h2>
            </NavLink>
          </MenuItem>
          {
            pth ? pth.map
            (
              list=>
              <MenuItem onClick={this.handleClose} key={"PTH"+list.id}>
                <NavLink to={"/Rating"+list.id} id={list.id} onClick={()=>{
                  this.handleClose();
                  
                }}>
                  <h2>Patient {list['patient']['patientCode']}, Task {list.taskId}, Hand {list.handId}</h2>
                </NavLink>
              </MenuItem>
            ) : null
          } 
        </Menu>
    </div>
    );
  }
}
export default Dropdown;

