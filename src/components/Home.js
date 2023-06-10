import React, {Component} from 'react';
import { render } from '@testing-library/react';
import { Typography, Grid, Paper, Container } from '@mui/material';
import Total from './../dashboard/Total';
import RatingList from './../dashboard/RatingList';
import axios from 'axios';

  
export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ptht: [],
      pth: [],
      message: "Ratings To Do",
      done: 0
    }
    this.changeList = this.changeList.bind(this);
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

  changeList = (input)=>{
    this.setState({done: input});
    if (input === 1){
      this.setState({message: "Ratings Done"});
    }
    else {
      this.setState({message: "Ratings To Do"});
    }
  }
  render(){
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ml: 6 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 180,
                }}
              >
                <Total 
                number={this.state.ptht.filter(list => list.isSubmitted===true).length} 
                showDone={1}
                changeList={this.changeList}/>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 180,
                }}
              >
                <Total 
                number={this.state.ptht.filter(list => list.isSubmitted===false).length} 
                showDone={0}
                changeList={this.changeList}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <RatingList message={this.state.message} done={this.state.done} ptht={this.state.ptht}/>
                </Paper>
            </Grid>
          </Grid>
        </Container>
        
    );
  }
  
};
  
export default Home;