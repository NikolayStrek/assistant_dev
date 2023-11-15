import React, { useState, useEffect, useRef } from "react";

// import * as Yup from "yup";
// import { useFormik } from "formik";
// import { useSnackbar } from "notistack";
// import axios from "axios";
import { 
  FormControl,
  OutlinedInput,
  InputLabel,
  TextField, 
  IconButton,
  InputAdornment
} from "@mui/material/";

import voiceListenerInit from './voicelistener';
import { request } from './api';

// import SendIcon from '@mui/icons-material/Send';
import TelegramIcon from '@mui/icons-material/Telegram';
import MicIcon from '@mui/icons-material/Mic';
// import MicOffIcon from '@mui/icons-material/MicOff';
import MicNoneIcon from '@mui/icons-material/MicNone';

const App = () => {
  // const { enqueueSnackbar } = useSnackbar();
  const textRef = useRef(null);
  const voiceRef = useRef(null);
  const audioFileBlob = useRef(null);

  const containerRef = useRef(null);
  const [isRecording, setRecording] = useState(false);
  
  const handleChange = (e) => {

  };



  const handleRecordMessage = (e) => {

    setRecording(!isRecording);

  };
  const handleSendMessage = () => {
    console.log('audioFileBlob.current', audioFileBlob.current, textRef.current.children[0].value );
    // debugger;
    const formData = new FormData();
    if (audioFileBlob.current) formData.append('file', audioFileBlob.current, `zee_${Date.now()}.ogg`);

    // debugger;
    request({ method: 'POST', route: '/ai/readvoice', formData, type: 'ab' }).then( resp => {

      console.log('resp', resp );
  

      if (resp) {

        const blob = new Blob([resp], { type: "audio/mp3" });

        const audio = document.createElement("audio");
        audio.src = URL.createObjectURL(blob);
        audio.play();
        
        // enqueueSnackbar('SERVER_SUCCESS_MESSAGE', {
        //   autoHideDuration: 'SERVER_SUCCESS_TIME',
        //   variant: "success",
        // });
      } else {
        // enqueueSnackbar("ERROR_MESSAGE", {
        //   autoHideDuration: "ERROR_TIME",
        //   variant: "error",
        // });
      }

    });
  };

  useEffect(()=>{
    voiceListenerInit({
      toggleButton: voiceRef,
      container: containerRef,
      audioFileBlob,
      handleSendMessage
    });
  }, []);

  return (
    <div ref={containerRef} className="wrapperModal">
                    <FormControl sx={{ mt: 1 }} fullWidth variant="outlined"  style={{
                                            width: `80%`,
                                            margin: "0px 10% 0 10%",
                                            position: 'fixed',
                                            bottom: '200px'
                                          }}>
                        <InputLabel htmlFor="outlined-adornment-question">Communicate</InputLabel>
                        <OutlinedInput ref={textRef}
                                          id="outlined-adornment-question"
                                          name="question"
                                          // defaultValue={process.env.REACT_APP_PASSWORD_CLIENT}
                                          // className={
                                          //   Boolean(touched.password && errors.password)
                                          //     ? classes.form_failed
                                          //     : classes.form_success
                                          // }
                                          type="text"
                                          onChange={handleChange}
                                          // error={
                                          //   Boolean(errorResponse) ||
                                          //   Boolean(touched.password && errors.password)
                                          // }
                                          endAdornment={
                                            <InputAdornment sx={{ mr: 1 }} position="end">
                                              <IconButton
                                                ref={voiceRef}
                                                sx={{ mr: '2px' }}
                                                aria-label="send provided message"
                                                onClick={handleRecordMessage}
                                                edge="end"
                                              >
                                              { isRecording ? <MicIcon sx={{ fill: '#ff0000' }} /> : <MicNoneIcon /> }
                                            </IconButton>
                                            <IconButton
                                                aria-label="send provided message"
                                                onClick={handleSendMessage}
                                                edge="end"
                                              >
                                              <TelegramIcon />
                                            </IconButton>
                                            </InputAdornment>
                                          }

                                          label="Communicate"
                        />
                    </FormControl>
    </div>
  );
};

export default App;
