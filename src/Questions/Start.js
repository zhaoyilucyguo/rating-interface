import React, { Component } from 'react'
import Completed from './Completed';
import Time from './Time';
import Impaired from './Impaired';
import Impairments from './Impairements';
import MTRInitialized from './MTRInitialized';
import Initialized from './Initialized';
import Confirm from './Confirm';
import Success from './Success';
import NextSeg from './NextSeg';


export class Start extends Component {
    state = {
        step: 1, 
        TaskID: this.props.values.TaskID,
        firstTask: this.props.values.firstTask,
        Type: this.props.values.Type, //task or segment
        Rating: undefined,
        Completed: undefined,
        Time: undefined, // too long 1, appropriate time 0 //
        Impaired: undefined,
        SegInitialized: undefined,
        Impairments: [],
        Types: {
            1: "Task",
            2: "IPT",
            3: "GI",
            4: "M&TR",
            5: "GP",
            6: "TG",
            7: "M&TR_2",
            8: "P&R"
        },
        
        result: {}
    }
    async componentDidMount() {
        this.setState({
            Impairments: []
        });
        this.setState({
            Completed: undefined
        });
        this.setState({
            Rating: undefined
        });
        this.setState({
            Time: undefined
        });
        this.setState({
            Impaired: undefined
        });
        this.setState({
            SegInitialized: undefined
        });
    }
    nextSegment = (step, Type, TaskID, SegInitialized, Completed) => {
        step = 1;
        if (Type === 1)  { // Task
            console.log("type 1");
            if (this.state.firstTask === 1) {
                step = 7;
            }
            else {
                console.log("first");
                if (Completed === 1 || SegInitialized === 1) Type = TaskID >= 17 ? 3 : 2;
                else {
                    console.log("skip");
                    Type = 1; //step=7; // skip rating for all segments
                    step = 1;
                }
                this.setState({firstTask: 1});
                this.onTrigger("firstTask", 1);
            }
            
        }
        else if (Type === 2) { // IPT
            Type = 4; //M&TR
        }
        else if (Type === 3) { //GI
            Type = 5; //GP
        }
        else if (Type === 4) { // M&TR
            Type = TaskID === 7 ? 6 : 8;
            if (Type===8){
                if (this.state.result[this.state.Types[Type]] !== undefined){
                    if (Type===8 && this.state.result[this.state.Types[Type]]['Skip'] === 1){
                        Type = 1 //step = 7;
                    }
                }
            }
        }
        else if (Type === 5) {
            Type = 6;
        }
        else if (Type === 6) {
            if (TaskID >= 17) Type = 1; //step = 7; // Confirm
            else Type = 7;
        }
        else if (Type === 7) {
            Type = 8;
            console.log(this.state.result);
            if (Type===8){
                if (this.state.result[this.state.Types[Type]] !== undefined){
                    console.log(this.state.result[this.state.Types[Type]]);
                    if (Type===8 && this.state.result[this.state.Types[Type]]['Skip'] === 1){
                        Type = 1 //step = 7;
                    }
                }
            }
        }
        else { // P&R
            Type = 1 //step = 7; // confirm
        }
        if (step === 7) console.log(this.state.result);
        this.setState({
            step: step
        });
        this.setState({
            Type: Type
        });
        // reset
        this.setState({
            Impairments: []
        });
        this.setState({
            Completed: undefined
        });
        this.setState({
            Rating: undefined
        });
        this.setState({
            Time: undefined
        });
        this.setState({
            Impaired: undefined
        });
        this.setState({
            SegInitialized: undefined
        });
        this.onTrigger("Type", Type);
        console.log(this.state.Types[Type], Type);
    }
    // Proceed to next step
    nextStep = () => {
        var {
            step,
            TaskID,
            Type,
            Types,
            Rating,
            Completed, // step1
            Time, // step2
            SegInitialized, // task step 3, segment step 4
            Impaired,// step 5
            result
        } = this.state;
        var obj;
        // completed
        if (step === 1){
            if (Type === 1) {
                step = Completed===1 ? 2 : 3;  // time or impaired
            }
            else {
                step = Completed===1 ? 2 : 4; // time or SegInitialized
            }
        }
        // time is too long
        else if (step === 2){
            step = 5;
        }
        // mtr initialized
        else if (step === 3){
            if (SegInitialized){
                Rating = '1';
                obj = {
                    'TaskID': TaskID, 
                    'Completed': Completed, 
                    'Type': Types[Type],
                    'Initialized': SegInitialized,
                    'Rating': Rating,
                    'Time': Time,
                    'Skip': 0
                }
                result[Types[Type]] = obj;
                step = 9;
            }
            else {
                Rating = '0';
                obj = {
                    'TaskID': TaskID, 
                    'Completed': Completed, 
                    'Type': Types[Type],
                    'Initialized': SegInitialized,
                    'Rating': Rating,
                    'Time': Time,
                    'Skip': 0
                }
                result[Types[Type]] = obj;
                //step = 7;
                this.nextSegment(step, Type, TaskID, SegInitialized, Completed); // confirm
                return;
            }
        }
        // segment initialized
        else if (step === 4){
            Rating = SegInitialized ? '1' : '0';
            obj = {
                'TaskID': TaskID, 
                'Completed': Completed, 
                'Type': Types[Type],
                'Initialized': SegInitialized,
                'Rating': Rating,
                'Skip': 0
            }
            result[Types[Type]] = obj;
            // if Seg = IPT && Rating of IPT = 0
            // then Rating of P&R = 0
            if (Type === 2 && Rating === '0'){
                obj = {
                    'TaskID': TaskID, 
                    'Completed': undefined, 
                    'Type': Types[8],
                    'Initialized': 0,
                    'Rating': Rating,
                    'Skip': 1
                }
                result[Types[8]] = obj;
            }
            // TO DO 1: identify next segment
            step = 9;
        }
        // impaired
        else if (step === 5){
            if (Type === 1) {
                if (Time) Rating = Impaired ? '2ti' : '2t';
                else Rating = Impaired ? '2i' : '3';
                obj = {
                    'Task ID': TaskID, 
                    'Completed': Completed, 
                    'Type': Types[Type],
                    'Time': Time,
                    'Initialized': 1,
                    'Impaired': Impaired,
                    'Rating': Rating,
                    'Skip': 0
                }
                result[Types[Type]] = obj;
                step = 9;
            }
            else {
                if (Impaired) {
                    Rating = Time ? '2ti' : '2i';
                    obj = {
                        'Task ID': TaskID, 
                        'Completed': Completed, 
                        'Type': Types[Type],
                        'Time': Time,
                        'Initialized': 1,
                        'Impaired': Impaired,
                        'Rating': Rating,
                        'Skip': 0
                    }
                    result[Types[Type]] = obj;
                    step = 6; // impairments
                }
                else {
                    Rating = Time ? '2t' : '3';
                    // step = 1;
                    obj = {
                        'Task ID': TaskID, 
                        'Completed': Completed, 
                        'Type': Types[Type],
                        'Time': Time,
                        'Initialized': 1,
                        'Impaired': Impaired,
                        'Rating': Rating,
                        'Skip': 0
                    }
                    result[Types[Type]] = obj;
                    step = 9;
                }
            }
        }
        else if (step === 6) { // impairments
            step = 9;
        }
        else if (step === 9) { // move on to the next segment
            this.nextSegment(step, Type, TaskID, SegInitialized, Completed);
            return;
        }
        else { // confirmation
            step = step+1;
        }
        this.setState({
            step: step
        });
        this.setState({
            Rating: Rating
        });
        this.setState({
            result: result
        });
    }
    // go back to prev step.
    prevStep = (input) => {
        var {
            step
        } = this.state;
        this.setState({
            step: input
        });
    }

    // handle fields change
    handleChange = (input1, input2) => e => {
        if (input1 === "Impairments") {
            var {
                Impairments, // step 6
                result,
                Types,
                Type,
                Rating,
                TaskID,
                Completed,
                Impaired,
                Time
            } = this.state;
            const index = Impairments.indexOf(input2);
            if (index > -1) Impairments.splice(index, 1); 
            else Impairments.push(input2);
            var obj = {
                'Task ID': TaskID, 
                'Completed': Completed, 
                'Type': Types[Type],
                'Time': Time,
                'Initialized': 1,
                'Impaired': Impaired,
                'Impairments': Impairments,
                'Rating': Rating,
                'Skip': 0
            }
            result[Types[Type]] = obj;
            this.setState({
                result: result
            });
            this.setState({Impairments: Impairments});
        }
        else {
            this.setState({
                [input1]: input2
            }, () => {
                this.nextStep();
            });
        }        
    }
    onTrigger = (input1, input2) => {
        this.props.parentCallback(input1, input2);
        // event.preventDefault();
    }

  render() {
    const { step, Type, Types, result, TaskID, SegInitialized, Rating } = this.state;
    const values = { Type, Types, result, TaskID, SegInitialized, Rating };
    switch(step){
        case 1:
            return (
                <Completed
                    handleChange={this.handleChange}
                    values={values}
                />
            )
        case 2:
            return (
                <Time
                    prevStep={this.prevStep}
                    handleChange={this.handleChange}
                    values={values}
                />
            )
        case 3:
            return (
                <MTRInitialized
                    prevStep={this.prevStep}
                    handleChange={this.handleChange}
                    values={values}
                />
            )
        case 4:
            return (
                <Initialized
                    prevStep={this.prevStep}
                    handleChange={this.handleChange}
                    values={values}
                />
            )
        case 5:
            return (
                <Impaired
                    prevStep={this.prevStep}
                    handleChange={this.handleChange}
                    values={values}
                />
            )
        case 6:
            return (
                <Impairments
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    handleChange={this.handleChange}
                    values={values}
                />
            )
        case 7:
            return (
                <Confirm
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    handleChange={this.handleChange}
                    values={values}
                />
            )
        case 8:
            return (
                <Success
                    prevStep={this.prevStep}
                    values={values}
                />
            )
        case 9:
            return (
                <NextSeg
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    values={values}
                />
            )
        default:
            return (
                <div>Default</div>
            )
    }
  }
}

export default Start