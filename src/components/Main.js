import React, {Component} from 'react';
import axios from 'axios';
import './Main.css'
import { Video } from '../Video/Video';
import { Rating } from '../Questions/Rating';

export class Main extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      VideoSegment: [],
      GetSegment: {},
      videos: [],
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
      const videos = data['files'];
      this.setState({ videos });
      
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
      cameraId,
      view,
      SegmentJson,
      currentTime
    } = this.state;
    const values = { 
      TaskId,
    };
    function switchView(id){
      console.log(id);
      view = Camera.filter(view => view.id === id)[0].ViewType;
    }
    return (

        <div className='content' key='content'>
          
          <div className='PlayVideo' key='PlayVideo'>
            {
              videos.filter(video => video.cameraId === this.state.cameraId)
              .map(video=>
                <div className="video-play" key={video.fileName}>
                  <h1>Patient {PatientCode}, Task {TaskId}, {Camera.filter(view => view.id === video.cameraId)[0].ViewType} View, Frame {document.getElementsByClassName("react-video-player")[0] ? Math.round(document.getElementsByClassName("react-video-player")[0].currentTime*30) : Math.round(currentTime*30)}</h1>
                  <Video url={"./Videos/"+video.fileName} sendTime={this.getTime}></Video>
                </div>
              )
            }
          </div>
          <div className='SideBar' key='SideBar'>
            <Rating 
            values={values}
            onSelect={this.onSelect}
            />
            <div className='SwitchView'>
              <div className='viewHeader'>
                <h1 >Switch View</h1>
              </div>
              <div className='SideVideos'>
              {
                videos.filter(video => video.cameraId !== this.state.cameraId)
                .map(video=>
                  <div className="video-preview"  key={video.fileName} onClick={() => {
                    switchView(video.cameraId);
                    this.setState({cameraId: video.cameraId});
                    this.setState({view});
                    this.setState({currentTime: 0});
                  }}>
                    <video src={"./Videos/"+video.fileName} title={"./Videos/"+video.fileName} className="sidebarVideo"  id={video.View}></video>
                    <div>
                      <h2>Patient {PatientCode}, Task {TaskId}, {Camera.filter(view => view.id === video.cameraId)[0].ViewType} View</h2>
                    </div>
                  </div>
                )
              }
              </div>
            </div>
            
          </div>
        </div>
    );
  }
}
