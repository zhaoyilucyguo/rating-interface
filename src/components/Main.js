import React, {Component} from 'react';
import axios from 'axios';
import './Main.css'
import { AiFillPlayCircle } from "react-icons/ai/";
import { Video } from '../Video/Video';
import { PlayBack } from '../Video/PlayBack';
import { Rating } from '../Questions/Rating';

export class Main extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      VideoSegment: [],
      segmentHistories: [],
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
      // definition: "",
      currentTime: 0,
      cameraId: 0,
      prevSegmentId: 1,
      instruction: "Please Select the IN and OUT Points for the Segment IPT",
      timeEnd: -1,
      Update: 0,
      showPlayBack: false,
      start: undefined,
      end: undefined      
    }

    // this.render=this.render.bind(this);

  }
  checkColor(VideoSegment){
    let i = 0;
        while ( i < VideoSegment.length) {
          VideoSegment[i]['IsChecked']=true;
          VideoSegment[i]['cameraId']=undefined;
          if (VideoSegment[i].segmentId === 2) {
            var out1 = VideoSegment[i-1].end;
            var out2 = VideoSegment[i].end;
            if (Math.abs(out1 - out2) > 2) {
              VideoSegment[i-1]['outColor']="yellow";
              VideoSegment[i]['outColor']="yellow";
            }
            else {
              VideoSegment[i]['inColor']="white";
              VideoSegment[i]['outColor']="white";
            }
          }
          else if (VideoSegment[i].segmentId === 3) {
            out1 = VideoSegment[i-2].end;
            out2 = VideoSegment[i].start;
            if (Math.abs(out1 - out2) > 2) {
              VideoSegment[i-2]['outColor']="yellow";
              VideoSegment[i]['inColor']="yellow";
            }
            else {
              VideoSegment[i]['inColor']="white";
              VideoSegment[i]['outColor']="white";
            }
          }
          else if (i > 0) {
            out1 = VideoSegment[i-1].end;
            out2 = VideoSegment[i].start;
            if (Math.abs(out1 - out2) > 2) {
              VideoSegment[i-1]['outColor']="yellow";
              VideoSegment[i]['inColor']="yellow";
            }
            else {
              VideoSegment[i]['inColor']="white";
              VideoSegment[i]['outColor']="white";
            }
          }
          VideoSegment[i]['color']="rgb(211, 211, 211)";
          i++;
          
        }
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
        
        this.checkColor(VideoSegment);
        VideoSegment[0]["color"]="#AFE1AF";
        this.setState({ VideoSegment });
        this.setState({Update: 1});
      }
    })
    await axios.get(`http://localhost:5000/TaskSegmentCameraMapping/`+this.state.PatientTaskHandMappingId)
    .then(res => {
      const data =res.data;
      const recommended_view = data['taskSegmentHandCameraMapping'];
      // const recommended_view = data['rec_view'].filter(view => view.taskId === this.state.TaskId);
      console.log(recommended_view);
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
      // const definition = recommended_view.filter(view => view.segmentId === this.state.segmentId)[0].Definition;
      // const definition = "undefined";
      this.setState({ recommended_view });
      this.setState({ cameraId });
      this.setState({ view });
      // this.setState({ definition });'
      var VideoSegment = this.state.VideoSegment;
      // if (this.state.IsSubmitted === 0){
      if (VideoSegment.length === 0){
        let i = 0;
        while (i < recommended_view.length) {
          VideoSegment.push({
            "patientTaskHandMappingId": this.state.PatientTaskHandMappingId,
            "segmentId": recommended_view[i].segmentId,
            "start":"",
            "end":"",
            "IsChecked": false,
            "inColor": "white",
            "outColor": "white",
            "color": "white",
            "cameraId": undefined
          });
          i++;
        }
        VideoSegment[0]["color"]="#AFE1AF";

        this.setState({ VideoSegment });
      }
    })
    await axios.get(`http://localhost:5000/Feedback`)
      .then(res => {
        const Feedback =res.data;
        this.setState({ Feedback });
    })
  }
  getTime = (currentTime) => {
    if (currentTime === undefined) currentTime=0;
    this.setState({currentTime: currentTime});
  }
  getPlay = (showPlayBack) => {
    console.log("reset playback");
    this.child.current.closePlayback();
    this.setState({showPlayBack: showPlayBack});
  }
  render() {

    var {
      VideoSegment,
      segmentHistories,
      videos,
      recommended_view,
      TaskId,
      PatientId,
      PatientCode,
      HandId,
      PatientTaskHandMapping,
      // definition,
      segmentId,
      Camera,
      Feedback,
      cameraId,
      view,
      SegmentJson,
      prevSegmentId,
      IsSubmitted,
      currentTime,
      instruction,
      showPlayBack,
      start,
      end
    } = this.state;
    const values = { 
      TaskId,
    };
    
   
    
  
    function onSelect(id) {
      segmentId = id;
      cameraId = recommended_view.filter(view => view.segmentId === parseInt(segmentId))[0].cameraId;
      view = recommended_view.filter(view => view.segmentId === parseInt(segmentId))[0].viewType;
    }
    function selectTimestamp(position, id) {
      var time = VideoSegment.filter(segment => segment.segmentId === id)[0][position];
      if (time === "") {
        // alert("Cannot find the frame of the video with an empty timestamp!");
        return;
      }
      document.getElementsByClassName("react-video-player")[0].currentTime=time/30;
      currentTime = time/30;
    }
    
    function onPlayback(segmentId) {
      start = VideoSegment.filter(segment => segment.segmentId === segmentId)[0]['start'];
      end = VideoSegment.filter(segment => segment.segmentId === segmentId)[0]['end'];
    }
  
    function switchView(id){
      console.log(id);
      var logsId = segmentHistories.length+1;
      segmentHistories.push({
        "id": logsId,
        "patientId": PatientId,
        // "patientCode": PatientCode,
        "taskId": TaskId,
        "cameraId": cameraId, 
        "handId": HandId,
        "segmentId": segmentId,
        "start": VideoSegment.filter(view => view.segmentId === segmentId)[0].start === ''? 0: VideoSegment.filter(view => view.segmentId === segmentId)[0].start,
        "end": VideoSegment.filter(view => view.segmentId === segmentId)[0].end === '' ? 0: VideoSegment.filter(view => view.segmentId === segmentId)[0].end,
        "createdAt": new Date(),
        "isSubmitted": false
      })
      segmentHistories.push({
        "id": logsId,
        "patientId": PatientId,
        // "patientCode": PatientCode,
        "taskId": TaskId,
        "cameraId": id, 
        "handId": HandId,
        "segmentId": segmentId,
        "start": VideoSegment.filter(view => view.segmentId === segmentId)[0].start === ''? 0: VideoSegment.filter(view => view.segmentId === segmentId)[0].start,
        "end": VideoSegment.filter(view => view.segmentId === segmentId)[0].end === '' ? 0: VideoSegment.filter(view => view.segmentId === segmentId)[0].end,
        "createdAt": new Date(),
        "isSubmitted": false
      })
      view = Camera.filter(view => view.id === id)[0].ViewType;
      VideoSegment.filter(view => view.segmentId === segmentId)[0].cameraId = id;
    }
    async function submit(e) {
      e.preventDefault();
      let j = 0;
      var submittedSegments = [];
      while (j < VideoSegment.length) {
        if (VideoSegment[j]['IsChecked'] === false){
          alert("Check all entries before you submit!");
          return;
        }
        submittedSegments.push({
          "id": VideoSegment[j]['id'] ? VideoSegment[j]['id'] : 0,
          "patientTaskHandMappingId": VideoSegment[j]['patientTaskHandMappingId'],
          "segmentId": VideoSegment[j]['segmentId'],
          "start": VideoSegment[j]['start']==='' ? 0: VideoSegment[j]['start'],
          "end": VideoSegment[j]['end']==='' ? 0: VideoSegment[j]['end']
        })
        j++;
        
      }

      let model = { 'submittedSegments' : submittedSegments, 'segmentHistories': segmentHistories}
      await axios.post('http://localhost:5000/VideoSegment/', model);
      await window.location.reload(false); 
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
          { showPlayBack ? <PlayBack url={videos.filter(video => video.cameraId === this.state.cameraId)[0].fileName} startFrame={start} endFrame={end} sendPlay={this.getPlay} ref={this.child}/>: null}
          <div className='SideBar' key='SideBar'>
            <Rating values={values}/>
            <div className='SwitchView'>
              <div className='viewHeader'>
                <h1 >Switch View</h1>

              </div>
              <div className='SideVideos'>
              {
                videos.filter(video => video.cameraId !== this.state.cameraId)
                .map(video=>
                  <div className="video-preview"  key={video.fileName} onClick={() => {
                    // this.child.current.closePlayback();
                    this.setState({showPlayBack: false});
                    switchView(video.cameraId);
                    this.setState({cameraId: video.cameraId});
                    this.setState({segmentHistories});
                    this.setState({view});
                    this.setState({currentTime: 0});
                    this.setState({VideoSegment});
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
