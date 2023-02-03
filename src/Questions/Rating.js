import {Stepper, Step, StepLabel} from '@mui/material';
import { Component } from 'react';
import Start from './Start';

export class Rating extends Component{
    constructor(props) {
      super(props);
      this.state = {
        display: "block",
        TaskID: this.props.values.TaskId,
        Type: 1,
        firstTask: 0,
        Types: {
            1: "Task",
            2: "IPT",
            3: "GI",
            4: "M&TR",
            5: "GP",
            6: "TG",
            7: "M&TR_2",
            8: "P&R",
            9: "Confirm Task"
        },
        Sequence:{
            1: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            2: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            3: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            4: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            5: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            6: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            7: ["Task", "IPT", "M&TR", "TG", "M&TR_2", "P&R", "Confirm Task"],
            8: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            9: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            10: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            11: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            12: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            13: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            14: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            15: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            16: ["Task", "IPT", "M&TR", "P&R", "Confirm Task"],
            17: ["Task", "GI", "GP", "TG", "Confirm Task"],
            18: ["Task", "GI", "GP", "TG", "Confirm Task"],
            19: ["Task", "GI", "GP", "TG", "Confirm Task"]
        },
      }
  }
  handleCallback = (input1, input2) =>{
    console.log('Rating', input1, input2);
    this.setState({[input1]: input2});
}
    render(){
    var {
        Type,
        TaskID,
        Types,
        Sequence,
        firstTask
      } = this.state;
    const values = { 
        Type,
        TaskID,
        firstTask
    };
    return (
    <div className="container-fluid">  
    <Stepper activeStep={firstTask===1 && Type === 1 ? Sequence[TaskID].indexOf("Confirm Task") : Sequence[TaskID].indexOf(Types[Type])} sx={{ pt: 3, pb: 5 }}>
        {Sequence[TaskID].map((label) => (
            <Step key={label}>
            <StepLabel>{label}</StepLabel>
            </Step>
        ))}
    </Stepper>
    <Start 
    values={values}
    parentCallback = {this.handleCallback}
    /> 
     
      </div>
      );
    }
  }
  
  export default Rating;
  