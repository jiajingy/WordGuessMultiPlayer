import * as React from "react";
import { Container, Grid, Paper } from "@mui/material";
import sharedStyles from "../../assets/styles/sharedStyles.module.scss";
import homePageStyles from "../../pages/HomePage/HomePageStyles.module.scss";


import NavBar from "../../components/NavBar/NavBar";
import RoomGameSettings from "../../components/RoomGameSettings/RoomGameSettings";
import RoomPlayerSection from "../../components/RoomPlayerSection/RoomPlayerSection";
import CountdownTimer from "../../components/CountdownTimer/CountdownTimer";
import LoadingOverlay from "react-loading-overlay-ts";
import Loadable from "react-loading-overlay-ts";
import BounceLoader from 'react-spinners/BounceLoader'
import { useParams } from "react-router-dom";




export default function GameRoomPage(props: any){
    const { roomCode } = useParams();

    const [startCountdown, setStartCountdown] = React.useState({isPlaying:false, completeText:"", playingText:"", duration:0})
    const startCountdownCallBack = (countdownProp) => {
        console.log("countdown!!!!");
        console.log(countdownProp);
        console.log(startCountdown);
        setStartCountdown(countdownProp);
    }
    return (
        <div className={sharedStyles.page}>
            <LoadingOverlay className={sharedStyles.overlay} active={startCountdown.isPlaying} spinner={<CountdownTimer isPlaying={startCountdown.isPlaying} completeText={startCountdown.completeText} playingText={startCountdown.playingText} duration={startCountdown.duration}></CountdownTimer>}>
                <NavBar />
                <Container style={{marginTop:"50px"}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8} lg={8}>
                            <Paper elevation={4}>
                                <RoomPlayerSection roomCode={roomCode} internalRoomId={props.internalRoomId} playerList={props.playerList} />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={4}>
                            <Paper elevation={4}>
                                <RoomGameSettings roomCode={roomCode} internalRoomId={props.internalRoomId} playerList={props.playerList} countdownCallback={startCountdownCallBack}/>
                            </Paper>
                        </Grid>
                    </Grid>

                    
                </Container>
            </LoadingOverlay>
        </div>
    );
}