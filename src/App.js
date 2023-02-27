import * as React from 'react';
import './App.css';
import { Component } from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import axios from 'axios';
import { Main } from './components/Main';
import Home from './components/Home';
import Dropdown from './components/Dropdown';
import SignIn from './SignIn';

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      pth: [],
      ptht: [],
      display: "block",
    }
    this.setLoggedIn = this.setLoggedIn.bind(this);
  }
    // this.render=this.render.bind(this);
  setLoggedIn(therapistId){
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('therapistId', therapistId);
  }   
componentDidMount() {
    axios.get(`http://localhost:5000/PatientTaskHandMapping`)
    .then(res => {
      const pth = res.data.filter(list => list.isSubmitted===true);
      this.setState({ pth });
    })
    axios.get(`http://localhost:5000/PTHTherapistMapping/`+parseInt(localStorage.getItem('therapistId')))
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
      console.log(ptht);
      this.setState({ ptht });
    })
}

  render(){
    var {ptht}=this.state;

  return (
   
    <BrowserRouter>
      <Dropdown 
      ptht={ptht}/>
      
    <Routes> 
      {/* sign in */}
      <Route path='/' element={<SignIn setLoggedIn={this.setLoggedIn} />} />
      {/* home page */}
      {
        localStorage.getItem('isLoggedIn') ? 
        <Route path='/home' element={<Home/>} />: null
      }
      {/* rating */}
      {
        localStorage.getItem('isLoggedIn') ? 
        ptht.map(list=>
            <Route key={'/Rating'+list.patientTaskHandMappingId} path={'/Rating'+list.patientTaskHandMappingId} element={
              <Main 
                PTHID={list.patientTaskHandMappingId} 
                HANDID={list.handId}
                PATIENTID={list.patientId}
                TASKID={list.taskId}
                NEXT={list.next}
              />
              // <div>{list.patientTaskHandMappingId}</div>
            }/>
        ) : null
      }
    </Routes> 
    </BrowserRouter> 
    
    );
  }
}

export default App;
