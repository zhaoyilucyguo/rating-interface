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
import axios from 'axios';



export class Start extends Component {
    state = {
        step: 1, 
        onSelect: this.props.onSelect,
        TaskID: this.props.values.TaskID,
        firstTask: this.props.values.firstTask,
        PatientTaskHandMappingId: this.props.values.PatientTaskHandMappingId,
        cameraId: this.props.values.cameraId,
        Camera: this.props.values.Camera,
        nextPth: this.props.values.nextPth,
        timeDurations: this.props.values.timeDurations,
        SegmentJson: [],
        revisitTask: undefined,
        Type: this.props.values.Type, //task or segment
        nType: undefined, // next type to rate
        Rating: undefined,
        IsCompleted: undefined,
        Time: undefined, // too long 1, appropriate time 0 //
        IsImpaired: undefined,
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
            4: "MTR",
            5: "GT",
            6: "TG",
            7: "MTR_2",
            8: "PR",
            10: "T",
            11: "Confirm"
        },
        result: {},
        tasksH: [],
        segmentsH: []
    }
    async componentDidMount() {
        var SegmentJson;
        await axios.get(`http://localhost:5000/Segment`)
        .then(res => {
          SegmentJson =res.data;
          this.setState({ SegmentJson });
        })
        await axios.get(`http://localhost:5000/VideoRating/`+this.state.PatientTaskHandMappingId+'/'+localStorage.getItem('therapistId'))
        .then(res => {
        const GetSegment =res.data;
        var task = GetSegment.task;
        var segments = GetSegment.segments;
        if (segments.length){
            var result = {};
            result['Task']=task;
            segments.forEach(function (arrayItem) {
                var id = arrayItem.segmentId;
                var name = SegmentJson.filter(i=>i.id === id)[0].SegmentLabel
                result[name]=arrayItem;
            });
            console.log(result);
            this.setState({ result });
            this.setState({ step: 7 });
            this.setState({ firstTask: 1 });
            this.setState({ Type: 1 });
            this.onTrigger("firstTask", 1);
            this.onTrigger("Type", 1);
        }
        })
    }
    nextType = (step, Type, TaskID, SegInitialized, IsCompleted) => {
        var nStep = 1;
        console.log("next type", step, Type, this.state.revisitTask);
        var nType = undefined;
        if (Type === 1)  { // Task
            if (this.state.firstTask === 1) {
                nStep = 7;
            }
            else {
                if (IsCompleted === 1 || SegInitialized === 1) nType = TaskID >= 17 ? 3 : 2;
                else {
                    nType = 1; //step=7; // skip rating for all segments
                    nStep = 1;
                }
                // this.setState({firstTask: 1});
                // this.onTrigger("firstTask", 1);
            }
            if (this.state.revisitTask === 0){
                // this.submit();
                window.location.href = '/Rating'+this.state.nextPth;
                return;
            }

        }
        else if (Type === 2) { // IP
            nType = 10; //T
        }
        else if (Type === 10) { // T
            nType = 4; //M&TR
        }
        else if (Type === 3) { //GIP
            nType = 5; //GT
        }
        else if (Type === 4) { // M&TR
            nType = TaskID === 7 ? 6 : 8;
            if (Type===8){
                if (this.state.result[this.state.Types[Type]] !== undefined){
                    if (Type===8 && this.state.result[this.state.Types[Type]]['Skip'] === 1){
                        nType = 1 //step = 7;
                    }
                }
            }
        }
        else if (Type === 6) {
            if (TaskID >= 17) nType = 1; //step = 7; // Confirm
            else nType = 7;
        }
        else if (Type === 7) {
            nType = 8;
            if (Type===8){
                if (this.state.result[this.state.Types[Type]] !== undefined){
                    if (Type===8 && this.state.result[this.state.Types[Type]]['Skip'] === 1){
                        nType = 1 //step = 7;
                    }
                }
            }
        }
        else if (Type === 11){ // confirmation page
            if (this.state.revisitTask === 1){ // revisit task
                this.nextSegment(1, 1, TaskID, SegInitialized, IsCompleted);
            }
            else { // confirm & move on
                this.submit();
                window.location.href = '/Rating'+this.state.nextPth;
            }
        }
        else { // P&R, GT
            nStep = 7; // confirm page
            nType = 11; // confirm scores
        }
        
        this.setState({
            nType
        });
        this.setState({
            nStep
        });
    }
    nextSegment = (step, Type, TaskID, SegInitialized, IsCompleted) => {
        console.log(Type, step, this.state.step);
        console.log(this.state.nType, this.state.nStep);
        if (Type === 1)  { // Task
            if (this.state.firstTask !== 1) {
                this.setState({firstTask: 1});
                this.onTrigger("firstTask", 1);
            }
            
            if (this.state.nType === undefined){ // if finished the "revisit" task, go to confirmation again
                if (this.state.step === 9){
                    Type = 1;
                    step = 7;
                }
                    
            }
            // else {
            //     step = 7; // if finished the "revisit" task, go to confirmation again
            // }
            else if (step !== 1){ // avoid revisit task, skip all segments
                Type = this.state.nType;
                step = this.state.nStep;
            }
        }
        else if (Type === 11){
            console.log("first task", this.state.firstTask);
            if (step !== 7){ // avoid revisit task, skip all segments
                Type = this.state.nType;
                step = this.state.nStep;
            }
            else {
                if (this.state.firstTask === 1){
                    // Type = 1;
                    // step = 1;
                    // finish revisit task
                }
                else {
                    // skip all segments
                }
            }
        }
        else {
            Type = this.state.nType;
            step = this.state.nStep;
        }
        console.log("nextsegment type", Type, " step ", step, " step ", this.state.step);
        this.setState({
            step: step
        });
        this.setState({
            Type: Type
        });
        this.state.onSelect(this.state.Types[Type]);
        // reset
        this.setState({Impairments: []});
        this.setState({IsCompleted: undefined});
        this.setState({Rating: undefined});
        this.setState({Time: undefined});
        this.setState({IsImpaired: undefined});
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
            Type,
            Types,
            IsCompleted, // step1
            Time, // step2
            IsImpaired,// step 5
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
            result,
            // tasksH,
            // segmentsH
        } = this.state;
        var obj;
        if (Type === 1){ // task level
            obj = {
                'patientTaskHandMappingId': PatientTaskHandMappingId,
                'therapistId': parseInt(localStorage.getItem('therapistId')),
                'completed': !!IsCompleted, 
                'initialized': !!SegInitialized,
                'time': !!Time,
                'impaired': !!IsImpaired,
                'skip': skip,
                'rating': Rating,
            }
        }
        else { //segment level
            obj = {
                'patientTaskHandMappingId': PatientTaskHandMappingId,
                'therapistId': parseInt(localStorage.getItem('therapistId')),
                'segmentId': SegmentJson.filter(i=>i.SegmentLabel === Types[Type])[0].id,
                'completed': !!IsCompleted, 
                'initialized': !!SegInitialized,
                'time': !!Time,
                'impaired': !!IsImpaired,
                'skip': skip,
                'seafr': !!SEAFR, 
                'ts': !!TS, 
                'rome': !!ROME,
                'fps': !!FPS,
                'wpat': !!WPAT,
                'ha': !!HA,
                'dp': !!DP,
                'dpo': !!DPO,
                'sat': !!SAT,
                // 'FPO': !!FPO,
                'dmr': !!DMR,
                'ths': !!THS,
                'pp': !!PP,
                'rating': Rating,
            }
        }
        result[Types[Type]] = obj;
        // obj['cameraId'] = cameraId;
        // if (Type === 1) tasksH.push(obj);
        // else segmentsH.push(obj);
        // this.setState({segmentsH: segmentsH});
        // this.setState({tasksH: tasksH});
        this.setState({result: result});
    }
    updateHistory = (id) => {
        var {
            segmentsH,
            tasksH,
            PatientTaskHandMappingId,
            cameraId,
            SegmentJson,
            Type,
            Types,
            IsCompleted, // step1
            Time, // step2
            IsImpaired,// step 5
            SegInitialized,
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
            Rating
        } = this.state;
        id = id || 0;
        if (id === 0) id=cameraId;
        else{
            this.setState({cameraId: id});
        }
        var obj;
        if (Type === 1){ // task level
            obj = {
                'PatientTaskHandMappingId': PatientTaskHandMappingId,
                'TherapistId': parseInt(localStorage.getItem('therapistId')),
                'cameraId': id,
                'Completed': !!IsCompleted, 
                'Initialized': !!SegInitialized,
                'Time': !!Time,
                'Impaired': !!IsImpaired,
                'rating': Rating,
            }
            tasksH.push(obj);
            this.setState({tasksH: tasksH});
        }
        else if (Type < 11){ //segment level
            obj = {
                'PatientTaskHandMappingId': PatientTaskHandMappingId,
                'TherapistId': parseInt(localStorage.getItem('therapistId')),
                'SegmentId': SegmentJson.filter(i=>i.SegmentLabel === Types[Type])[0].id,
                'cameraId': id,
                'Completed': !!IsCompleted, 
                'Initialized': !!SegInitialized,
                'Time': !!Time,
                'Impaired': !!IsImpaired,
                'SEAFR': !!SEAFR, 
                'TS': !!TS, 
                'ROME': !!ROME,
                'FPS': !!FPS,
                'WPAT': !!WPAT,
                'HA': !!HA,
                'DP': !!DP,
                'DPO': !!DPO,
                'SAT': !!SAT,
                'FPO': !!FPO,
                'DMR': !!DMR,
                'THS': !!THS,
                'PP': !!PP,
                'rating': Rating,
            }
            segmentsH.push(obj);
            this.setState({segmentsH: segmentsH});
        }
        
    }
    submit = () => {
        var {
            result,
            tasksH,
            segmentsH,
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
        var RatingResult = {
            "task": task, 
            "segments": segments,
            // "TaskHistory": tasksH,
            // "SegmentsHistory": segmentsH
        };
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
            Rating,
            IsCompleted, // step1
            Time, // step2
            SegInitialized, // task step 3, segment step 4
            IsImpaired,// step 5
            result
        } = this.state;
        console.log(step);
        // IsCompleted
        if (step === 1){
            if (Type === 1) {
                step = IsCompleted===1 ? 2 : 3;  // time or impaired
            }
            else {
                step = IsCompleted===1 ? 2 : 4; // time or SegInitialized
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
                this.nextType(step, Type, TaskID, SegInitialized, IsCompleted);
                step = 9;
            }
            else {
                Rating = '0';
                this.updateObj(0, Rating, SegInitialized);
                //step = 7;
                this.nextSegment(7, 11, TaskID, SegInitialized, IsCompleted); // confirm
                // this.nextType(step, Type, TaskID, SegInitialized, IsCompleted);
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
            this.nextType(step, Type, TaskID, SegInitialized, IsCompleted);
            step = 9;
        }
        // impaired
        else if (step === 5){
            if (Type === 1) {
                if (Time) Rating = IsImpaired ? '2ti' : '2t';
                else Rating = IsImpaired ? '2i' : '3';
                this.updateObj(0, Rating, 1);
                this.nextType(step, Type, TaskID, SegInitialized, IsCompleted);
                step = 9;
            }
            else {
                if (IsImpaired) {
                    Rating = Time ? '2ti' : '2i';
                    this.updateObj(0, Rating, 1);
                    step = 6; // impairments
                }
                else {
                    Rating = Time ? '2t' : '3';
                    // step = 1;
                    this.updateObj(0, Rating, 1);
                    this.nextType(step, Type, TaskID, SegInitialized, IsCompleted);
                    step = 9;
                }
            }
        }
        else if (step === 6) { // impairments
            this.nextType(step, Type, TaskID, SegInitialized, IsCompleted);
            step = 9;
        }
        
        else if (step === 9) { // move on to the next segment
            this.nextSegment(step, Type, TaskID, SegInitialized, IsCompleted);
            return;
        }
        else if (step === 7){ // confirmation
            this.nextType(step, Type, TaskID, SegInitialized, IsCompleted);
            return;
        }
        // if (step === 8) this.submit();
        console.log(step);
        this.setState({
            step: step
        });
        this.setState({
            Rating: Rating
        });
        this.setState({
            result: result
        });
        this.updateHistory();
    }
    // go back to prev step.
    prevStep = (input) => {
        if (this.state.Type === 1){
            if (input === 1) {
                this.setState({IsCompleted: undefined});                
            }
            else if (input === 2){
                this.setState({Time: undefined});
            }
            else if (input === 3){
                this.setState({SegInitialized: undefined});
            }
            else{
                this.setState({IsImpaired: undefined});
            }
        }
        else{
            if (input === 1) {
                this.setState({IsCompleted: undefined});                
            }
            else if (input === 2){
                this.setState({Time: undefined});
            }
            else if (input === 4){
                this.setState({SegInitialized: undefined});
            }
            else if (input === 5){
                this.setState({IsImpaired: undefined});
            }
            else{
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
            }
        }
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
        // else if (input1 === "revisitTask" && input2 === 0){
        //     console.log("hello restart");
        //     this.setState({[input1]: input2});
        // }
        else {
            console.log(input1, input2);
            if (input1 === 'IsCompleted' && input2 === 1){
                this.setState({SegInitialized: 1});
            }
            this.setState({
                [input1]: input2
            }, () => {
                this.nextStep();
            });
        }        
    }
    onTrigger = (input1, input2) => {
        if (input1 !== "step") {
            this.props.parentCallback(input1, input2);
        }
        this.setState({[input1]: input2});
        // event.preventDefault();
    }
  render() {
    const { step, Type, nType, Types, result, TaskID, SegInitialized, Rating, IsCompleted, IsImpaired, revisitTask, firstTask, timeDurations} = this.state;
    const values = { Type, nType, Types, result, TaskID, SegInitialized, Rating, IsCompleted, IsImpaired, revisitTask, firstTask, timeDurations};
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
                    parentCallback = {this.onTrigger}
                    values={values}
                />
            )
        case 8:
            return (
                <Success
                    prevStep={this.prevStep}
                    values={values}
                    parentCallback = {this.onTrigger}
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