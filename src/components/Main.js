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
      VideoSegment: [],
      GetSegment: {},
      videos: [],
      cameraDic: {},
      recommended_view: [],
      PatientTaskHandMapping1: [],
      Camera: [],
      Feedback: [],
      PatientTaskHandMappingId: this.props.PTHID,
      TaskId: this.props.TASKID,
      PatientId: this.props.PATIENTID,
      PatientCode: this.props.PATIENTCODE,
      HandId: this.props.HANDID,
      IsSubmitted: this.props.IsSubmitted,
      segmentId: 1, // start at IPT
      SegmentJson: [],
      view: "",
      currentTime: 0,
      cameraId: 0,
      prevSegmentId: 1,
      timeEnd: -1,
      Update: 0,
      start: undefined,
      end: undefined      
    }

    // this.render=this.render.bind(this);

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

    await axios.get(`http://localhost:5000/VideoSegment/`+this.state.PatientTaskHandMappingId)
    .then(res => {
      const GetSegment =res.data;
      if (GetSegment.length){
        var VideoSegment = GetSegment;
        
        this.setState({ VideoSegment });
        this.setState({Update: 1});
      }
    })
    await axios.get(`http://localhost:5000/TaskSegmentCameraMapping/`+this.state.PatientTaskHandMappingId)
    .then(res => {
      const data =res.data;
      const recommended_view = data['taskSegmentHandCameraMapping'];
      const fullvideos = data['files'];
      var videos = [];
      var views_used_rec = []
      var cameraDic = {};
      var cameraCnt = 0;
      for (let i = 0; i < recommended_view.length; i++) {
        views_used_rec.push(recommended_view[i].cameraId);
      }
      for (let j = 0; j < fullvideos.length; j++) {
        var curCamId = fullvideos[j].cameraId;
        if (views_used_rec.includes(curCamId)){
          videos.push(fullvideos[j]);
          cameraCnt++;
          cameraDic[cameraCnt] = "camera"+curCamId;
          cameraDic["camera"+curCamId] = cameraCnt;
        }
      }
      this.setState({ videos });
      this.setState({ cameraDic:cameraDic });
      var cameraId = 0;
      var view = '';
      if (this.state.TaskId >= 17) {
        this.setState({ segmentId: 7 });
        this.setState({ prevSegmentId: 7 });
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
  }
  getTime = (currentTime) => {
    if (currentTime === undefined) currentTime=0;
    this.setState({currentTime: currentTime});
  }
  onSelect = (name) => {
    if (name === "Task") return;
    var segmentId = this.state.SegmentJson.filter(i=>i.SegmentLabel === name)[0].id;
    var cameraId = this.state.recommended_view.filter(view => view.segmentId === parseInt(segmentId))[0].cameraId;
    var view = this.state.recommended_view.filter(view => view.segmentId === parseInt(segmentId))[0].viewType;
    this.setState({segmentId: segmentId});
    this.setState({cameraId: cameraId});
    this.setState({view: view});
  }
  
  render() {
    var {
      VideoSegment,
      videos,
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
      SegmentJson,
      currentTime,
      cameraDic
    } = this.state;
    const values = { 
      TaskId,
    };
    function switchView(id){
      view = Camera.filter(view => view.id === id)[0].ViewType;
    }
    
    function switchCam(side) {
      var id = undefined;
      var index = cameraDic["camera"+cameraId];
      if (side === "right"){
        if (index === videos.length) {
          id = cameraDic[1]
        }
        else {
          id = cameraDic[index+1];
        }
      }
      else{
        if (index === 1) {
          id = cameraDic[videos.length]
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
            this.setState({cameraId: switchCam("left")});
          }}/>
          </span>
            {
              videos.filter(video => video.cameraId === this.state.cameraId)
              .map((video, i)=>
                <div className="video-play" key={video.fileName}>
                  <Typography component="h1" variant="h4" align="left">
                  Patient {PatientCode}, Task {TaskId}, {Camera.filter(view => view.id === video.cameraId)[0].ViewType} View
                  {/* Frame {document.getElementsByClassName("react-video-player")[0] ? Math.round(document.getElementsByClassName("react-video-player")[0].currentTime*30) : Math.round(currentTime*30)} */}
                  </Typography>
                  <Video url={"./Videos/"+video.fileName} sendTime={this.getTime}></Video>
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
            this.setState({cameraId: switchCam("right")});
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
            />
            </Paper>
            </Container>
          </div>
        </div>
    );
  }
}
