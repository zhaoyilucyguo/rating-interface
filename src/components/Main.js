import React, {Component} from 'react';
import axios from 'axios';
import './Main.css'
import { Video } from '../Video/Video';
import { Rating } from '../Questions/Rating';
import {Typography, Container, Paper} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';



export class Main extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      GetSegment: {},
      taskVideos: [],
      segmentVideos: [],
      displayVideos: [],
      cameraDic: {},
      recommended_view: [],
      Camera: [],
      views_used_rec: [],
      PatientTaskHandMappingId: this.props.PTHID,
      TaskId: this.props.TASKID,
      PatientId: this.props.PATIENTID,
      // PatientCode: this.props.PATIENTCODE,
      HandId: this.props.HANDID,
      NEXT: this.props.NEXT,
      segmentId: 1, // start at IPT
      SegmentJson: [],
      view: "",
      currentTime: 0,
      cameraId: 0,
      currentOnTask: true  // determine the folder for videos: Videos or TrimmedVideos    
    }
    this.child = React.createRef();
  }
 
  async componentDidMount() {
    if (this.state.HandId === 1) {
      await axios.get(`http://localhost:5000/CameraLeft`)
      .then(res => {
        const Camera =res.data;
        this.setState({ Camera });
      })
      if (this.state.TaskId >= 17) this.setState({ cameraId: 1 });
      else this.setState({ cameraId: 2 });
    }
    else {
      await axios.get(`http://localhost:5000/CameraRight`)
      .then(res => {
        const Camera =res.data;
        this.setState({ Camera });
      })
      if (this.state.TaskId >= 17) this.setState({ cameraId: 4});
      else this.setState({ cameraId: 2 });
    }

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
      const fullvideos = data['files'];
      var displayVideos = [];
      var views_used_rec = []
      var cameraDic = {};
      var cameraCnt = 0;
      for (let i = 0; i < recommended_view.length; i++) {
        views_used_rec.push(recommended_view[i].cameraId);
      }
      for (let j = 0; j < fullvideos.length; j++) {
        var curCamId = fullvideos[j].cameraId;
        if (views_used_rec.includes(curCamId)){
          displayVideos.push(fullvideos[j]);
          cameraCnt++;
          cameraDic[cameraCnt] = "camera"+curCamId;
          cameraDic["camera"+curCamId] = cameraCnt;
        }
      }
      var taskVideos = displayVideos;
      this.setState({taskVideos});
      this.setState({ displayVideos: fullvideos });
      this.setState({ cameraDic:cameraDic });
      this.setState({views_used_rec});
      var cameraId = 0;
      var view = '';
      if (this.state.TaskId >= 17) {
        this.setState({ segmentId: 7 });
        cameraId = recommended_view.filter(view => view.segmentId === 7)[0].cameraId;
        view = recommended_view.filter(view => view.segmentId === 7)[0].viewType;
      }
      else {
        cameraId = recommended_view.filter(view => view.segmentId === this.state.segmentId)[0].cameraId;
        view = recommended_view.filter(view => view.segmentId === this.state.segmentId)[0].viewType;
      }
      this.setState({ recommended_view });
      this.setState({ cameraId });
      this.setState({ view });
    })
    await axios.get(`http://localhost:5000/SegmentFileInfo/`+this.state.PatientTaskHandMappingId)
    .then(res => {
      const data =res.data;
      const fullvideos = data;
      var segmentVideos = [];
      for (let j = 0; j < fullvideos.length; j++) {
        var curCamId = fullvideos[j].cameraId;
        if (this.state.views_used_rec.includes(curCamId)){
          segmentVideos.push(fullvideos[j]);
        }
      }
      console.log(segmentVideos);
      this.setState({ segmentVideos });
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
      this.setState({cameraId: this.state.views_used_rec[0]}) // set view to the default view
      return;
    }
    else if (name === "Confirm Scores" || name === undefined) {
      return;
    }
    console.log(name);
    var segmentId = this.state.SegmentJson.filter(i=>i.SegmentLabel === name)[0].id;
    var cameraId = this.state.recommended_view.filter(view => view.segmentId === parseInt(segmentId))[0].cameraId;
    var view = this.state.recommended_view.filter(view => view.segmentId === parseInt(segmentId))[0].viewType;
    this.setState({segmentId: segmentId});
    this.setState({cameraId: cameraId});
    this.setState({view: view});
    var displayVideos = this.state.segmentVideos.filter(view => view.segmentId === parseInt(segmentId));
    this.setState({displayVideos});
    this.setState({currentOnTask: false});
  }
  updateCamera=(id)=>{
    this.child.current.updateCamera(id);
  }
  render() {
    var {
      displayVideos,
      recommended_view,
      TaskId,
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
      NEXT
    } = this.state;
    const values = { 
      TaskId,
      PatientTaskHandMappingId,
      cameraId,
      Camera,
      NEXT
    };
    function switchView(id){
      view = Camera.filter(view => view.id === id)[0].ViewType;
    }
    
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
            {
              displayVideos.filter(video => video.cameraId === this.state.cameraId)
              .map((video, i)=>
                <div className="video-play" key={video.fileName}>
                  <Typography component="h1" variant="h4" align="left">
                  Patient {PatientCode}, Task {TaskId}, {Camera.filter(view => view.id === video.cameraId)[0].ViewType} View
                  {/* Frame {document.getElementsByClassName("react-video-player")[0] ? Math.round(document.getElementsByClassName("react-video-player")[0].currentTime*30) : Math.round(currentTime*30)} */}
                  </Typography>
                  <Video 
                  url={currentOnTask? "./Videos/"+video.fileName : "./TrimmedVideos/"+video.fileName} 
                  sendTime={this.getTime}></Video>
                </div>
              )
            }
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
          <div className='SideBar' key='SideBar'>
            {/* <div className="Rating"> */}
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Rating
            </Typography>
            <Rating 
            values={values}
            onSelect={this.onSelect}
            ref={this.child}
            />
            </Paper>
            </Container>
          </div>
        </div>
    );
  }
}
