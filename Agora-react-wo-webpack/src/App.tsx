import React, { useReducer, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import $ from "jquery";
import StreamPlayer from "agora-stream-player";
import { SnackbarProvider, useSnackbar } from "notistack";
import PersonIcon from '@material-ui/icons/Person';
import CropLandscapeIcon from '@material-ui/icons/CropLandscape';
import Table from "./components/Table"

import { useCamera, useMicrophone, useMediaStream } from "./hooks";
import AgoraRTC from "./utils/AgoraEnhancer";
import { async } from "q";
import { TransitionGroup } from "react-transition-group";
import { ModalProvider } from "react-modal-hook";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 12
  },
  title: {
    fontWeight: 400

  },
  divider: {
    marginBottom: "32px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around"
  },
  buttonItem: {
    width: "38.2%"
  },
  advanceSettings: {
    marginTop: 16
  },
  table: {
    width: 75,
    height: 75
  }
}));

const defaultState = {
  appId: "4ad55b2dcdce439aa14961efdad65a93",
  channel: "VidChatTest",
  uid: "",
  token: "0064ad55b2dcdce439aa14961efdad65a93IABUSK84whTi0XY64g3M+FyLeKD33wzXrnBLAZtj31b8JssKSV4AAAAAEABT7MmEA2h+XgEAAQADaH5e",
  cameraId: "",
  microphoneId: "",
  mode: "rtc",
  codec: "h264"
};

const updateLayout = async (listItems: any) => {
  for(var i = 0; i < listItems.length; i ++){
    var offsetAngle = 360 / listItems.length;
    var rotateAngle = offsetAngle * i;
    $(listItems[i]).css("transform", "rotate(" + rotateAngle + "deg) translate(0, -200px) rotate(-" + rotateAngle + "deg)")
    return listItems
  };
};

const reducer = (
  state: typeof defaultState,
  action: { type: string; [propName: string]: any }
) => {
  switch (action.type) {
    default:
      return state;
    case "setAppId":
      return {
        ...state,
        appId: action.value
      };
    case "setChannel":
      return {
        ...state,
        channel: action.value
      };
    case "setUid":
      return {
        ...state,
        uid: action.value
      };
    case "setToken":
      return {
        ...state,
        token: action.value
      };
    case "setCamera":
      return {
        ...state,
        cameraId: action.value
      };
    case "setMicrophone":
      return {
        ...state,
        microphoneId: action.value
      };
    case "setMode":
      return {
        ...state,
        mode: action.value
      };
    case "setCodec":
      return {
        ...state,
        codec: action.value
      };
  }
};

function App() {
  const classes = useStyles();
  const [isJoined, setisJoined] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [agoraClient, setClient] = useState<any>(undefined)
  const [tables, setTables] = useState<any>([])
  // const agoraClient = AgoraRTC.createClient({ mode: state.mode, codec: state.codec });
  const cameraList = useCamera();
  const microphoneList = useMicrophone();
  let [localStream, remoteStreamList, streamList] = useMediaStream(agoraClient);
  const { enqueueSnackbar } = useSnackbar();

  const update = (actionType: string) => (e: React.ChangeEvent<unknown>) => {
    return dispatch({
      type: actionType,
      value: (e.target as HTMLInputElement).value
    });
  };

  const join = async () => {
    const listItems= $(".list-item");
    const client = AgoraRTC.createClient({ mode: state.mode, codec: state.codec })
    setTables([...tables, client ])
    setClient(client)
    setIsLoading(true);
    try {
      const uid = isNaN(Number(state.uid)) ? null : Number(state.uid);
      await client.init(state.appId);
      await client.join(state.token, state.channel, uid);
      const stream = AgoraRTC.createStream({
        streamID: uid || 12345,
        video: true,
        audio: true,
        screen: false
      });
      // stream.setVideoProfile('480p_4')
      await stream.init();
      await client.publish(stream);
      setIsPublished(true);
      setisJoined(true);
      console.log(listItems)
      if(listItems) {
        updateLayout(listItems)
      }
      enqueueSnackbar(`Joined channel ${state.channel}`, { variant: "info" });
    } catch (err) {
      console.log(err)
      enqueueSnackbar(`Failed to join, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const addPlayersToTable = async() => {

  }

  const publish = async () => {
    setIsLoading(true);
    console.log(streamList)
    console.log(tables)
    try {
      if (localStream) {
        await agoraClient.publish(localStream);
        setIsPublished(true);
       
      }
      enqueueSnackbar("Stream published", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to publish, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const leave = async () => {
    setIsLoading(true);
    try {
      if (localStream) {
        localStream.close();
        agoraClient.unpublish(localStream);
      }
      await agoraClient.leave();
      setIsPublished(false);
      setisJoined(false);
      enqueueSnackbar("Left channel", { variant: "info" });
    } catch (err) {
      enqueueSnackbar(`Failed to leave, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const unpublish = () => {
    console.log($(".list-item"))
    if (localStream) {
      agoraClient.unpublish(localStream);
      setIsPublished(false);
      enqueueSnackbar("Stream unpublished", { variant: "info" });
    }
  };

  const JoinLeaveBtn = () => {
    return (
      <Button
        className={classes.buttonItem}
        color={isJoined ? "secondary" : "primary"}
        onClick={isJoined ? leave : join}
        variant="contained"
        disabled={isLoading}
      >
        {isJoined ? "Leave" : "Join"}
      </Button>
    );
  };

  const PubUnpubBtn = () => {
    return (
      <Button
        className={classes.buttonItem}
        color={isPublished ? "secondary" : "default"}
        onClick={isPublished ? unpublish : publish}
        variant="contained"
        disabled={!isJoined || isLoading}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
    );
  };

  return (
    <React.Fragment>
      <AppBar style={{ background: '#000000' }}>
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            Virtual Coworking Space
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.divider} />
     
      {/* <div className="box">
        {  
            tables.map((t:any) => 
            <ul id="#tables">
            <li className='box-row'>
                <span>
                    <h4>table length is {tables.length} and {streamList.length} active streams</h4>
                </span>
            </li>
            <hr/>
            </ul>
        )
            
            }
        </div>  */}
        {/* <div className="tables"> */}
        {/* {  
            tables.map((t:any) => 
            <ul>
            <li className='circle big'>
            <Grid item xs={12} md={8}>
              <li>Host</li>
            {remoteStreamList.map((stream: any, i: any) => (
              <li  className={"circle stream" + i}> <PersonIcon/>{i + stream.getId()}</li>
            ))}
          </Grid>
            </li>
            <hr/>
            </ul>
        )
            } */}
              {  
            tables.map((t:any) => 
            // <ul>
            <div className='table'>
             <PersonIcon/><CropLandscapeIcon style={{ width: 200, height: 200 }}> </CropLandscapeIcon>
            {remoteStreamList.map((stream: any, i: any) => (
              <li className={"circle stream" + i}> <PersonIcon/>{i + stream.getId()}</li>
            ))}
          </div>
              )
            }
<       div className="table-container">
          {<Table></Table>}
          {<Table></Table>}
        </div>
    </React.Fragment>
  );
}

export default function AppWithNotification() {
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={2500}
      maxSnack={5}
    >
    <ModalProvider rootComponent={TransitionGroup}>

      <App />
      </ModalProvider>
    </SnackbarProvider>
  );
}
