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
import { Rating } from './Rating';
import axios from 'axios';



export class Start extends Component {
    state = {
        step: 1, 
        onSelect: this.props.onSelect,
        TaskID: this.props.values.TaskID,
        firstTask: this.props.values.firstTask,
        PatientTaskHandMappingId: this.props.values.PatientTaskHandMappingId,
        SegmentJson: [],
        Type: this.props.values.Type, //task or segment
        Rating: undefined,
        Completed: undefined,
        Time: undefined, // too long 1, appropriate time 0 //
        Impaired: undefined,
        SegInitialized: undefined,
        SEAFR: 0, 
        TS: 0, 
        ROME: 0,
        FPS: 0,
        WPAT: 0,
        HA: 0,
        DP: 0,
        DPO: 0,
        SAT: 0,
        FPO: 0,
        DMR: 0,
        THS: 0,
        PP: 0,
        Impairments: [],
        Types: {
            1: "Task",
            2: "IP",
            3: "GIP",
            4: "M&TR",
            5: "GT",
            6: "TG",
            7: "M&TR_2",
            8: "P&R",
            10: "T"
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
        await axios.get(`http://localhost:5000/Segment`)
        .then(res => {
          const SegmentJson =res.data;
          this.setState({ SegmentJson });
        })
    }
    nextSegment = (step, Type, TaskID, SegInitialized, Completed) => {
        step = 1;
        if (Type === 1)  { // Task
            if (this.state.firstTask === 1) {
                step = 7;
            }
            else {
                if (Completed === 1 || SegInitialized === 1) Type = TaskID >= 17 ? 3 : 2;
                else {
                    Type = 1; //step=7; // skip rating for all segments
                    step = 1;
                }
                this.setState({firstTask: 1});
                this.onTrigger("firstTask", 1);
            }
        }
        else if (Type === 2) { // IP
            Type = 10; //T
        }
        else if (Type === 10) { // T
            Type = 4; //M&TR
        }
        else if (Type === 3) { //GIP
            Type = 5; //GT
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
        else if (Type === 6) {
            if (TaskID >= 17) Type = 1; //step = 7; // Confirm
            else Type = 7;
        }
        else if (Type === 7) {
            Type = 8;
            if (Type===8){
                if (this.state.result[this.state.Types[Type]] !== undefined){
                    if (Type===8 && this.state.result[this.state.Types[Type]]['Skip'] === 1){
                        Type = 1 //step = 7;
                    }
                }
            }
        }
        else { // P&R, GT
            Type = 1 //step = 7; // confirm
        }
        if (step === 7) this.submit();
        this.setState({
            step: step
        });
        this.setState({
            Type: Type
        });
        this.state.onSelect(this.state.Types[Type]);
        // reset
        this.setState({Impairments: []});
        this.setState({Completed: undefined});
        this.setState({Rating: undefined});
        this.setState({Time: undefined});
        this.setState({Impaired: undefined});
        this.setState({SegInitialized: undefined});
        this.setState({SEAFR: 0});
        this.setState({TS: 0});
        this.setState({ROME: 0});
        this.setState({FPS: 0});
        this.setState({WPAT: 0});
        this.setState({HA: 0});
        this.setState({DP: 0});
        this.setState({DPO: 0});
        this.setState({SAT: 0});
        this.setState({FPO: 0});
        this.setState({DMR: 0});
        this.setState({THS: 0});
        this.setState({PP: 0});
        this.onTrigger("Type", Type);
    }
    updateObj = (skip, Rating, SegInitialized) => {
        var {
            PatientTaskHandMappingId,
            SegmentJson,
            TaskID,
            Type,
            Types,
            Completed, // step1
            Time, // step2
            Impaired,// step 5
            result,
            SEAFR, 
            TS, 
            ROME,
            FPS,
            WPAT,
            HA,
            DP,
            DPO,
            SAT,
            FPO,
            DMR,
            THS,
            PP,
        } = this.state;
        var obj;
        if (Type === 1){ // task level
            obj = {
                'PatientTaskHandMappingId': PatientTaskHandMappingId,
                'Completed': Completed, 
                'Initialized': SegInitialized,
                'Time': Time,
                'Impaired': Impaired,
                'Skip': skip,
                'Rating': Rating,
            }
        }
        else { //segment level
            obj = {
                'PatientTaskHandMappingId': PatientTaskHandMappingId,
                'SegmentId': SegmentJson.filter(i=>i.SegmentLabel === Types[Type])[0].id,
                'Completed': Completed, 
                'Initialized': SegInitialized,
                'Time': Time,
                'Impaired': Impaired,
                'Skip': skip,
                'SEAFR': SEAFR, 
                'TS': TS, 
                'ROME': ROME,
                'FPS': FPS,
                'WPAT': WPAT,
                'HA': HA,
                'DP': DP,
                'DPO': DPO,
                'SAT': SAT,
                'FPO': FPO,
                'DMR': DMR,
                'THS': THS,
                'PP': PP,
                'Rating': Rating,
            }
        }
        result[Types[Type]] = obj;
        this.setState({result: result});
    }
    submit = () => {
        var {
            result
        } = this.state;
        delete result['Task'].Skip;
        var task = result['Task'];
        var segments = [];
        var segment = undefined;
        for (segment in result){
            if (segment !== 'Task'){
                delete result[segment].Skip;
                segments.push(result[segment]);
            }
        }
        var RatingResult = {"Task": task, "Segments": segments};
        axios.post('http://localhost:5000/VideoRating/',
        RatingResult)
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
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
                this.updateObj(0, Rating, SegInitialized);
                step = 9;
            }
            else {
                Rating = '0';
                this.updateObj(0, Rating, SegInitialized);
                //step = 7;
                this.nextSegment(step, Type, TaskID, SegInitialized, Completed); // confirm
                return;
            }
        }
        // segment initialized
        else if (step === 4){
            Rating = SegInitialized ? '1' : '0';
            this.updateObj(0, Rating, SegInitialized);
            // if Seg = IPT && Rating of IPT = 0
            // then Rating of P&R = 0
            if (Type === 2 && Rating === '0'){
                this.updateObj(1, Rating, 0);
            }
            // TO DO 1: identify next segment
            step = 9;
        }
        // impaired
        else if (step === 5){
            if (Type === 1) {
                if (Time) Rating = Impaired ? '2ti' : '2t';
                else Rating = Impaired ? '2i' : '3';
                this.updateObj(0, Rating, 1);
                step = 9;
            }
            else {
                if (Impaired) {
                    Rating = Time ? '2ti' : '2i';
                    this.updateObj(0, Rating, 1);
                    step = 6; // impairments
                }
                else {
                    Rating = Time ? '2t' : '3';
                    // step = 1;
                    this.updateObj(0, Rating, 1);
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
        this.setState({
            step: input
        });
    }

    // handle fields change
    handleChange = (input1, input2) => e => {
        if (input1 === "Impairments") {
            var bit = undefined;
            if (this.state[input2] === 1) bit=0;
            else bit=1;
            this.setState({
                [input2]: bit
            }, () => {
                this.updateObj(0, this.state.Rating, 1);
            });
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