import React, {Component} from 'react';
import axios from 'axios';
import './Main.css'
import { Video } from '../Video/Video';
import { Rating } from '../Questions/Rating';
import { Typography, Container, Paper, Button } from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { BiChevronLeft, BiChevronRight, BiLeftArrowCircle } from 'react-icons/bi';
import Comment from './Comment';


export class Main extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      GetSegment: {},
      taskVideos: [],
      segmentVideos: [],
      displayVideos: [],
      unimpairedVideos: [],
      onSelectUnimpaired: false,
      onSelectWhole: false,
      cameraDic: {},
      recommended_view: [],
      Camera: [],
      CameraLeft: [],
      CameraRight: [],
      views_used_rec: [],
      PatientTaskHandMappingId: this.props.PTHID,
      TaskId: this.props.TASKID,
      TaskDescription: [],
      PatientId: this.props.PATIENTID,
      // PatientCode: this.props.PATIENTCODE,
      HandId: this.props.HANDID,
      NEXT: this.props.NEXT,
      UNIMPAIREDPTH: this.props.UNIMPAIREDPTH,
      segmentId: 1, // start at IPT
      Type: "Task",
      SegmentJson: [],
      view: "",
      currentTime: 0,
      cameraId: 0,
      currentOnTask: true  // determine the folder for videos: Videos or TrimmedVideos    
    }
    this.child = React.createRef();
  }
 
  async componentDidMount() {
    await axios.get(`http://localhost:5000/CameraLeft`)
    .then(res => {
      const CameraLeft =res.data;
      this.setState({ CameraLeft });
      if (this.state.HandId === 1) {
        this.setState({ Camera: CameraLeft });
        if (this.state.TaskId >= 17) this.setState({ cameraId: 2 });
        else this.setState({ cameraId: 4 });
      }
    })      
    await axios.get(`http://localhost:5000/CameraRight`)
    .then(res => {
      const CameraRight =res.data;
      this.setState({ CameraRight });
      if (this.state.HandId === 2) {
        this.setState({ Camera: CameraRight });
        if (this.state.TaskId >= 17) this.setState({ cameraId: 2});
        else this.setState({ cameraId: 1 });
      }
    })   
    await axios.get(`http://localhost:5000/TaskDescription/` + this.state.TaskId)
    .then(res => {
      const TaskDescription =res.data;
      this.setState({ TaskDescription });
    })
    await axios.get(`http://localhost:5000/Segment`)
    .then(res => {
      const SegmentJson =res.data;
      this.setState({ SegmentJson });
    })
    var views_used_rec = [];
    await axios.get(`http://localhost:5000/TaskSegmentCameraMapping/`+this.state.PatientTaskHandMappingId)
    .then(res => {
      const data =res.data;
      var recommended_view = [];
      recommended_view = data['taskSegmentHandCameraMapping'];
      var fullvideos = data['files'];
      // var j = 0;
      // while (j < fullvideos.length) { // check for invalid files
      //   var file = fullvideos[j].fileName;
      //   var id = fullvideos[j].id;
      //   if (file.includes(' ')) {
      //     fullvideos.splice(j, 1); // Remove the object at the found index
      //   }
      //   else {
      //     j++;
      //   }
      // }
      var displayVideos = [];
      var views_used_rec = [];
      var definitions = {};
      var cameraDic = {};
      var cameraCnt = 0;
      for (let i = 0; i < recommended_view.length; i++) {
        views_used_rec.push(recommended_view[i].cameraId);
        var segmentId = recommended_view[i].segmentId;
        var segment = this.state.SegmentJson.filter(i=>i.id === segmentId)[0].SegmentLabel;
        definitions[segment]=recommended_view[i].definition;
      }
      localStorage.setItem('definitions', JSON.stringify(definitions));
      for (let j = 0; j < fullvideos.length; j++) {
        var curCamId = fullvideos[j].cameraId;
        // if (views_used_rec.includes(curCamId)){
          displayVideos.push(fullvideos[j]);
          cameraCnt++;
          cameraDic[cameraCnt] = "camera"+curCamId;
          cameraDic["camera"+curCamId] = cameraCnt;
        // }
      }
      var taskVideos = displayVideos;
      this.setState({taskVideos});
      this.setState({ displayVideos: fullvideos });
      this.setState({ cameraDic:cameraDic });
      this.setState({views_used_rec});
      // var cameraId = 0;
      var view = '';
      if (this.state.TaskId >= 17) {
        this.setState({ segmentId: 7 });
        // cameraId = recommended_view.filter(view => view.segmentId === 7)[0].cameraId;
        view = recommended_view.filter(view => view.segmentId === 7)[0].viewType;
      }
      else {
        // cameraId = recommended_view.filter(view => view.segmentId === this.state.segmentId)[0].cameraId;
        view = recommended_view.filter(view => view.segmentId === this.state.segmentId)[0].viewType;
      }
      this.setState({ recommended_view });
      // this.setState({ cameraId:  });
      this.setState({ view });
    })
    await axios.get(`http://localhost:5000/SegmentFileInfo/`+this.state.PatientTaskHandMappingId)
    .then(res => {
      const data =res.data;
      const fullvideos = data;
      var segmentVideos = [];
      var timeDurations = {};
      var timeDuration = 0;
      for (let j = 0; j < fullvideos.length; j++) {
        var curCamId = fullvideos[j].cameraId;
        // if (this.state.views_used_rec.includes(curCamId)){
          segmentVideos.push(fullvideos[j]);
          var segmentId = fullvideos[j].segmentId;
          var segment = this.state.SegmentJson.filter(i=>i.id === segmentId)[0].SegmentLabel;
          if (timeDurations[segment] === undefined) {
            timeDurations[segment]=fullvideos[j].timeDuration;
            timeDuration += fullvideos[j].timeDuration;
          }
        // }
      }      
      this.setState({ segmentVideos });
      timeDurations['Task'] = timeDuration;
      localStorage.setItem('timeDurations', JSON.stringify(timeDurations));
    })
    await axios.get(`http://localhost:5000/GetUnImapiredVideo/`+this.state.PatientId+'/'+this.state.TaskId)
      .then(res => {
        var unimpairedVideos = res.data;
        this.setState({ unimpairedVideos });
      })
  }
  getTime = (currentTime) => {
    if (currentTime === undefined) currentTime=0;
    this.setState({currentTime: currentTime});
  }
  onSelect = (name) => {
    if (name === "Task" || name === "Revisit Task") {
      this.setState({displayVideos: this.state.taskVideos});
      this.setState({currentOnTask: true});
      this.setState({cameraId: this.state.views_used_rec[0]}); // set view to the default view
      this.setState({Type: "Task"});
      return;
    }
    else if (name === "Confirm" || name === undefined) {
      return;
    }
    // if (name === "PR") name = "P&R";
    // if (name === "MTR") name = "M&TR";
    var segmentId = this.state.SegmentJson.filter(i=>i.SegmentLabel === name)[0].id;
    var cameraId = this.state.recommended_view.filter(view => view.segmentId === parseInt(segmentId))[0].cameraId;
    var view = this.state.recommended_view.filter(view => view.segmentId === parseInt(segmentId))[0].viewType;
    this.setState({segmentId: segmentId});
    this.setState({cameraId: cameraId});
    this.setState({view: view});
    var displayVideos = this.state.segmentVideos.filter(view => view.segmentId === parseInt(segmentId));
    this.setState({displayVideos});
    this.setState({currentOnTask: false});
    this.setState({Type: name});
  }
  selectWhole=()=>{
    if (this.state.onSelectWhole === false){
      this.setState({displayVideos: this.state.taskVideos});  
      this.setState({currentOnTask: true});
      this.setState({onSelectWhole: true}); 
    }
    else{      
      var segmentId = this.state.SegmentJson.filter(i=>i.SegmentLabel === this.state.Type)[0].id;
      var displayVideos = this.state.segmentVideos.filter(view => view.segmentId === parseInt(segmentId));
      this.setState({currentOnTask: false});
      this.setState({displayVideos});
      this.setState({onSelectWhole: false}); 
    }      
  }
  selectUnimpaired=()=> {
    if (this.state.onSelectUnimpaired === false){
      this.setState({displayVideos: this.state.unimpairedVideos});  
      this.setState({currentOnTask: true});
      this.setState({onSelectUnimpaired: true});  
      if (this.state.HandId === 2) {
        this.setState({ Camera: this.state.CameraLeft });
        if (this.state.TaskId >= 17) this.setState({ cameraId: 2 });
        else this.setState({ cameraId: 4 });
      }
      else {
        this.setState({ Camera: this.state.CameraRight });
        if (this.state.TaskId >= 17) this.setState({ cameraId: 2});
        else this.setState({ cameraId: 1 });
      }
    }
    else{
      if (this.state.Type === "Task") {
        this.setState({displayVideos: this.state.taskVideos});  
      }
      else {
        var segmentId = this.state.SegmentJson.filter(i=>i.SegmentLabel === this.state.Type)[0].id;
        var displayVideos = this.state.segmentVideos.filter(view => view.segmentId === parseInt(segmentId));
        this.setState({currentOnTask: false});
        this.setState({displayVideos});
      }      
      this.setState({onSelectUnimpaired: false});  
      if (this.state.HandId === 1) {
        this.setState({ Camera: this.state.CameraLeft });
        if (this.state.TaskId >= 17) this.setState({ cameraId: 2 });
        else this.setState({ cameraId: 4 });
      }
      else {
        this.setState({ Camera: this.state.CameraRight });
        if (this.state.TaskId >= 17) this.setState({ cameraId: 2});
        else this.setState({ cameraId: 1 });
      }
    }      
  }
  updateCamera=(id)=>{
    this.child.current.updateCamera(id);
  }
  render() {
    var {
      displayVideos,
      recommended_view,
      TaskId,
      Type,
      PatientId,
      PatientCode,
      HandId,
      segmentId,
      Camera,
      cameraDic, 
      cameraId,
      view,
      currentTime,
      cameraDic,
      PatientTaskHandMappingId,
      cameraId,
      Camera,
      currentOnTask,
      NEXT,
      UNIMPAIREDPTH,
    } = this.state;
    const values = { 
      TaskId,
      PatientTaskHandMappingId,
      cameraId,
      Camera,
      NEXT,
    };
    function switchView(id){
      view = Camera.filter(view => view.id === id)[0].ViewType;
    }
    const styles = {
      container: {
        height: '80vh', // set the height of the container to 100% of the viewport height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    };
    function switchCam(side) {
      var id = undefined;
      var index = cameraDic["camera"+cameraId];
      if (side === "right"){
        if (index === displayVideos.length) {
          id = cameraDic[1]
        }
        else {
          id = cameraDic[index+1];
        }
      }
      else{
        if (index === 1) {
          id = cameraDic[displayVideos.length]
        }
        else {
          id = cameraDic[index-1];
        }
      }
      id = parseInt(id.substring(6));
      return id;
    }
    const theme = createTheme();
    return (

        <div className='content' key='content'>
          {/* <div> */}
          <div className='PlayVideo' key='PlayVideo'>
            <span className="changeColor">
              <BiChevronLeft 
              className="chevron"
              size={70}
              onMouseOver={({target})=>target.style.color="#2596be"}
              onMouseOut={({target})=>target.style.color="black"}
              onClick={()=>{
                var id = switchCam("left");
                this.setState({
                  cameraId: id
                }, () => {
                    this.updateCamera(id);
                });
              }}/>
            </span>
            { displayVideos.length > 0 ?
              displayVideos.filter(video => video.cameraId === this.state.cameraId)
              .map((video, i)=>
                <div className="video-play" key={video.fileName}>
                  {/* <div stype="display:flex;"> */}
                  <Typography component="h1" variant="h4" align="left" display="inline">
                  Task {TaskId}, 
                  Patient {PatientId}, 
                  {Camera.filter(view => view.id === video.cameraId)[0].ViewType} View                  
                  </Typography>
                  {this.state.onSelectUnimpaired===true || this.state.onSelectWhole ? 
                  <Typography component="p" align="right" display="inline" style={{ backgroundColor: 'yellow' }}>
                  (Don't rate this!)
                </Typography> : 
                  <Typography component="p" align="right" display="inline">
                    {this.state.recommended_view.filter(
                    view => view.segmentId === this.state.segmentId)[0].cameraId === video.cameraId ? 
                    "(Recommended View)" : null}
                  </Typography>
                  }
                  {/* </div> */}
                  <Video 
                  url={currentOnTask? "./Videos/"+video.fileName : "./TrimmedVideos/"+video.fileName} 
                  sendTime={this.getTime}></Video>
                </div>
              )
            : 
            <div style={styles.container}>
              <Typography component="h1" variant="h4" align="left" display="inline">
                No Video Captured
              </Typography>
            </div>}
            
            <span className="changeColor">
              <BiChevronRight 
              className="chevron"
              size={70}
              onMouseOver={({target})=>target.style.color="#2596be"}
              onMouseOut={({target})=>target.style.color="black"}
              onClick={()=>{
                var id = switchCam("right");
                this.setState({
                  cameraId: id
                }, () => {
                    this.updateCamera(id);
                });
              }}/>          
              </span>  
                    
          </div>
          
          {/* </div> */}
          <div className='SideBar' key='SideBar'>
           
              <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                {this.state.onSelectWhole===false ?
                <Button onClick={this.selectUnimpaired}>
                  {this.state.onSelectUnimpaired===true ? "Go Back to Impaired Views" : "Show Unimpaired Views"}
                </Button>:null}
                {this.state.Type !== "Task" && this.state.onSelectUnimpaired===false ? <Button onClick={this.selectWhole}>
                  {this.state.onSelectWhole===true ? "Go Back to the SEGMENT" : "Show THE WHOLE TASK"}
                </Button> : null}
              </Container> 
              
            {/* <div className="Rating"> */}
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
              <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
              <Typography component="h1" variant="h4" align="center">
                Rating
              </Typography>
              <Typography component="p" variant="p">
                  Task {TaskId}: {this.state.TaskDescription.scale} Subscale, {this.state.TaskDescription.definition}.
              </Typography>
              <Typography variant="body2" display="inline" style={{ backgroundColor: 'yellow' }}>{TaskId >= 17 ? " (Please use your best judgement if the camera view is unclear)" : ""}</Typography>
                  
              <Rating 
                values={values}
                onSelect={this.onSelect}
                ref={this.child}
              />
              </Paper>           
            </Container>
            
            <Comment 
            PatientTaskHandMappingId={PatientTaskHandMappingId} 
            SegmentId={segmentId}
            cameraId={cameraId}
            Type={Type}
            />
            
          </div>
        </div>
    );
  }
}
