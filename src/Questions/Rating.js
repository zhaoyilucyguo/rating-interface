import {Stepper, Step, StepLabel} from '@mui/material';
import React, {Component} from 'react';
import Start from './Start';

export class Rating extends Component{
    constructor(props) {
      super(props);
      this.state = {
        display: "block",
        TaskID: this.props.values.TaskId,
        PatientTaskHandMappingId: this.props.values.PatientTaskHandMappingId,
        cameraId: this.props.values.cameraId,
        Camera: this.props.values.cameraId,
        onSelect: this.props.onSelect,
        nextPth: this.props.values.NEXT,
        Type: 1,
        firstTask: 0,
        Types: {
            1: "Task",
            2: "IP",
            3: "GIP",
            4: "M&TR",
            5: "GT",
            6: "TG",
            7: "M&TR_2",
            8: "P&R",
            9: "Revisit Task",
            10: "T",
            11: "Confirm Scores",
        },
        GeneralSequence: {
          1: ["Task", "IP", "T", "M&TR", "P&R", "Confirm Scores", "Revisit Task"],
          2: ["Task", "IP", "T", "M&TR", "TG", "M&TR_2", "P&R", "Confirm Scores", "Revisit Task"],
          3: ["Task", "GIP", "GT", "Confirm Scores", "Revisit Task"]
        },
        Sequence:{
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 3,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 3,
            18: 3,
            19: 3
        },
      }
      this.child = React.createRef()
  }
  handleCallback = (input1, input2) =>{
    this.setState({[input1]: input2});
  }
  updateCamera1=(id)=>{
    this.child.current.updateHistory(id);
  }
  updateCamera=(id)=>{
    this.updateCamera1(id);
  }
  render(){
    var {
      Type,
      TaskID,
      Types,
      Sequence,
      firstTask,
      GeneralSequence,
      PatientTaskHandMappingId,
      cameraId,
      Camera,
      nextPth
    } = this.state;
    const { onSelect}=this.props;
    const values = { 
        Type,
        TaskID,
        firstTask,
        onSelect,
        PatientTaskHandMappingId,
        cameraId,
        Camera,
        nextPth
    };
    return (
      <div className="container-fluid">  
        <Stepper activeStep={
          firstTask===1 && Type === 1 ? 
          GeneralSequence[Sequence[TaskID]].indexOf("Revisit Task") : 
          GeneralSequence[Sequence[TaskID]].indexOf(Types[Type])
          } sx={{ pt: 3, pb: 5 }}>
            {GeneralSequence[Sequence[TaskID]].map((label) => (
              <Step key={label}>
              <StepLabel>{label}</StepLabel>
              </Step>
            ))}
        </Stepper>
        <Start 
          values={values}
          onSelect={onSelect}
          parentCallback = {this.handleCallback}
          ref={this.child}
        /> 
      </div>
    );
  }
}
  
export default Rating;
  