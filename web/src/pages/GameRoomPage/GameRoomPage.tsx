import * as React from "react";
import { Container, Grid, Paper } from "@mui/material";
import sharedStyles from "../../assets/styles/sharedStyles.module.scss";
import homePageStyles from "../../pages/HomePage/HomePageStyles.module.scss";

import NavBar from "../../components/NavBar/NavBar";
import RoomGameSettings from "../../components/RoomGameSettings/RoomGameSettings";
import RoomPlayerSection from "../../components/RoomPlayerSection/RoomPlayerSection";



export default function GameRoomPage(props: any){
    return (
        <div className={sharedStyles.page}>
            <NavBar />
            <Container style={{marginTop:"50px"}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8} lg={8}>
                        <Paper elevation={4}>
                            <RoomPlayerSection roomCode={props.roomCode} internalRoomId={props.internalRoomId} playerList={props.playerList}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <Paper elevation={4}>
                            <RoomGameSettings roomCode={props.roomCode} internalRoomId={props.internalRoomId} playerList={props.playerList}/>
                        </Paper>
                    </Grid>
                </Grid>
                
                
            </Container>
        </div>
    );
}