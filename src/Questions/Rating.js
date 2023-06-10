import {Stepper, Step, StepLabel, Typography, Container} from '@mui/material';
import React, {Component} from 'react';
import Start from './Start';
import DefinitionSection from './DefinitionSection';
import axios from 'axios';


export class Rating extends Component{
    constructor(props) {
      super(props);
      this.state = {
        display: "block",
        TaskID: this.props.values.TaskId,
        step: 1, 
        result: {},
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
            4: "MTR",
            5: "GT",
            6: "TG",
            7: "MTR_2",
            8: "PR",
            9: "Revisit Task",
            10: "T",
            11: "Confirm",
        },
        GeneralSequence: {
          1: ["Task", "IP", "T", "MTR", "PR", "Confirm", "Revisit Task"],
          2: ["Task", "IP", "T", "MTR", "TG", "MTR_2", "PR", "Confirm", "Revisit Task"],
          3: ["Task", "GIP", "GT", "Confirm", "Revisit Task"]
        },
        Sequence:{
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 2,
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
      this.child = React.createRef();
      this.selectType = this.selectType.bind(this);
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.Type !== prevState.Type) {
  //     // This will update the child component whenever the count state changes
  //     this.child.current.forceUpdate();
  //     console.log("update");
  //   }
  // }
  
  handleCallback = (input1, input2) =>{
    this.setState({[input1]: input2});
  }
  updateCamera1=(id)=>{
    this.child.current.updateHistory(id);//bug
  }
  updateCamera=(id)=>{
    this.updateCamera1(id);
  }
  

  selectType=(label)=>{
    // var sequence = this.state.GeneralSequence[this.state.Sequence[this.state.TaskID]];
    // var before = sequence.indexOf(this.state.Types[this.state.Type])
    // var after = sequence.indexOf(label);
    // console.log("before, ", before, "after, ", after);
    console.log(this.state.GeneralSequence[this.state.Sequence[this.state.TaskID]]);
    for (let key in this.state.Types) {
      if (this.state.Types[parseInt(key)] === label) {
        let Type = parseInt(key);
        if (this.state.result[this.state.Types[Type]] !== undefined){
          if (this.state.Type !== Type){          
            this.setState({Type});
            let step = 1;   
            if (Type === 11) step=7;
            // this.setState({step});
            this.state.onSelect(label);
            this.child.current.updateTypeStep(Type, step);
            return;
          }
        }
        else {
          if (this.state.Types[Type] === "Confirm" || this.state.Types[Type] === "Revisit Task"){
            if (this.state.Type !== Type){  
              let shouldExit = false;
              this.state.GeneralSequence[this.state.Sequence[this.state.TaskID]].forEach((seq) => {
              // for (let seq in this.state.GeneralSequence[this.state.Sequence[this.state.TaskID]]) {
                let seqType = this.state.result[seq];
                if (seq !== "Confirm" && seq !== "Revisit Task"){
                  if (this.state.result[seq] === undefined) {
                    console.log(seq);
                    shouldExit = true;
                    return;
                  }
                }                
              });   
              if (shouldExit) return;  
              this.setState({Type});
              let step = 1;   
              if (Type === 11) step=7;
              // this.setState({step});
              this.state.onSelect(label);
              this.child.current.updateTypeStep(Type, step);
              return;
            }
          }
            
        }
        
      }
    }
    
    // for (let i=0; i< this.state.Typ)
  }
  updateResult=(res)=>{
    // console.log(res);
    this.setState({result: res})
  }
  render(){
    var {
      Type,
      TaskID,
      step,
      result,
      Types,
      Sequence,
      firstTask,
      GeneralSequence,
      Sequence,
      PatientTaskHandMappingId,
      cameraId,
      Camera,
      nextPth,
    } = this.state;
    const { onSelect}=this.props;
    const values = { 
      // Type,
        TaskID,
        // step,
        result,
        firstTask,
        onSelect,
        PatientTaskHandMappingId,
        GeneralSequence,
        cameraId,
        Camera,
        Sequence,
        nextPth,
    };
    return (
      <div className="container-fluid">  
        
        <Stepper 
          // style={{ display: 'inline-block' }}
          activeStep={
            firstTask===1 && Type === 1 ? 
            GeneralSequence[Sequence[TaskID]].indexOf("Revisit Task") : 
            GeneralSequence[Sequence[TaskID]].indexOf(Types[Type])
          } sx={{ pt: 3, pb: 5 }}>
            {GeneralSequence[Sequence[TaskID]].map((label) => (
              <Step key={label}>
              <StepLabel onClick={()=>{
                this.selectType(label);
              }}>{label}</StepLabel>
              </Step>
            ))}
        </Stepper>
        
       
        <Start 
          values={values}
          Type={this.state.Type}
          onSelect={onSelect}
          parentCallback = {this.handleCallback}
          ref={this.child}
          // ref={ref => this.childComponent = ref}
          updateResult={this.updateResult}
        />

      </div>
    );
  }
}
  
export default Rating;
  