import React, {Component} from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { NavLink } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { AiOutlineCheck } from "react-icons/ai/";
import axios from 'axios';



export class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      ptht: [],
      pth: [],
      open: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  async componentDidMount() {
    await axios.get(`http://localhost:5000/PatientTaskHandMapping`)
    .then(res => {
      const pth = res.data.filter(list => list.isSubmitted===true);
      this.setState({ pth });
    })
    await axios.get(`http://localhost:5000/PTHTherapistMapping/`+parseInt(localStorage.getItem('therapistId')))
    .then(res => {
      var data = res.data;
      var ptht = [];
      var pth = this.state.pth;
      for (let j = 0; j < data.length; j++) {
        let obj = data[j];
        let id = obj.patientTaskHandMappingId;
        let pthObj =  pth.filter(i => i.id === id)[0];
        if (pthObj !== undefined){
          if (j < data.length-1) {
            obj.patientId = pthObj.patientId;
            obj.taskId = pthObj.taskId;
            obj.handId = pthObj.handId;
            obj.next = data[j+1].patientTaskHandMappingId;
          }
          else{
            obj.next=undefined;
          }
          ptht.push(obj);
        }
      }
      this.setState({ ptht });
    })
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
    localStorage.setItem('isLoggedIn', false);
    window.location.href = '/';
  }
  handleClose() {
    this.setState({anchorEl: null});
    this.setState({open: false});
    window.location.reload();
  }
//   componentDidMount() {
//     this.setState({
//         ptht: this.props.ptht
//     });
// }
  // componentDidUpdate(prevProps) {
  //   // Typical usage (don't forget to compare props):
  //   if (this.props.ptht !== prevProps.ptht) {
  //     this.componentDidMount();
  //   }
  // }
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
            ptht.filter(list => list.isSubmitted===true).map
            (
              list=>
              <MenuItem onClick={this.handleClose} key={"PTH"+list.patientTaskHandMappingId}>
                <NavLink to={'/Rating'+list.patientTaskHandMappingId} id={list.patientTaskHandMappingId} style={{ textDecoration: 'none' }}
                onClick={()=>{
                  // this.handleClose();
                }}>
                  <Typography>
                    Rating {list.patientTaskHandMappingId}:
                    Patient {list.patientTaskHandMapping.patientId},
                    Task {list.patientTaskHandMapping.taskId} 
                    {/* Hand {list.patientTaskHandMapping.handId} */}
                    <AiOutlineCheck size={20} color="green"/>
                  </Typography>
                </NavLink>
              </MenuItem>
            )
          } 
          {
            ptht.filter(list => list.isSubmitted===false).map
            (
              list=>
              <MenuItem onClick={this.handleClose} key={"PTH"+list.patientTaskHandMappingId}>
                <NavLink to={'/Rating'+list.patientTaskHandMappingId} id={list.patientTaskHandMappingId} style={{ textDecoration: 'none' }}
                onClick={()=>{
                  // this.handleClose();
                }}>
                  <Typography>
                    Rating {list.patientTaskHandMappingId}:
                    Patient {list.patientTaskHandMapping.patientId},
                    Task {list.patientTaskHandMapping.taskId}
                    {/* Hand {list.patientTaskHandMapping.handId} */}
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

