import * as React from 'react';
import './App.css';
import { Component } from 'react';
import { Route, Routes, BrowserRouter, NavLink } from "react-router-dom";
import axios from 'axios';
import { Main } from './components/Main';
import { Rating } from './Questions/Rating';
import Home from './components/Home';
import { Button, Menu, MenuItem } from '@mui/material';
import Dropdown from './components/Dropdown';
// import { Home } from './components/Home';


class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      PatientTaskHandMapping: [],
      display: "block"
    }
    // this.render=this.render.bind(this);
}
componentDidMount() {
  // axios.get('https://localhost:44305/api/Segmentation/GetPatientTaskInformation',{ crossdomain: true })
    axios.get(`http://localhost:5000/PatientTaskHandMapping`)
    .then(res => {
      const data =res.data;
      const PatientTaskHandMapping = data//.filter(list => list.IsSubmitted===1);
      this.setState({ PatientTaskHandMapping });
      console.log(PatientTaskHandMapping);
    })
}

  render(){
  return (
   
    <BrowserRouter>
      <Dropdown pth={this.state.PatientTaskHandMapping}/>
      
    <Routes> 
      <Route path='/' element={<Home/>} />
      {
      this.state.PatientTaskHandMapping
      .map
      (
          list=>
          <Route  key={"PTH"+list.id} path={"/Rating"+list.id} element={
            <Main 
              PTHID={list.id} 
              HANDID={list.handId}
              PATIENTID={list.patientId}
              PATIENTCODE={list['patient']['patientCode']}
              TASKID={list.taskId}
              IsSubmitted={list.IsSubmitted}
            />
          }/>
      )
      }
    </Routes> 
    </BrowserRouter> 
    
    );
  }
}

export default App;
