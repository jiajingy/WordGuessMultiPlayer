import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import StarsIcon from '@mui/icons-material/Stars';
import { useLocation, useNavigate } from 'react-router-dom';
import gameContext from '../../gameContext';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import { IconButton } from '@mui/material';
import { VerticalAlignCenter } from '@mui/icons-material';


export default function RoomPlayerSection(props: any) {
    const { setInRoom, isInRoom, ipAddr } = React.useContext(gameContext); 

    const navigate = useNavigate();
    const { state } = useLocation() as any;
    let isPageRdyToShow = false;
    isPageRdyToShow = (state===null) ? false : true;

    const [playerList, setPlayerList] = React.useState(state.playerList);
    const handleChangePlayerList = (newPlayerList: any) => {
        setPlayerList(newPlayerList);
    }

    const [gameData, setGameData] = React.useState(state.gameData);
    const handleFindLastRoundWinner = () => {

    }
    console.log("asdsad");
    console.log(playerList);
    console.log(gameData);
    const handleGameRoomUpdate = () => {
        if (socketService.socket){
            gameService.onGameRoomUpdate(socketService.socket, (newGameRoom:any) => {
                handleChangePlayerList(newGameRoom.playerList);
            });
        }
    }
    
    React.useEffect(() => {
        // Redirect to home page if no room ID
        // This means user accesses this url directly
        if(!isPageRdyToShow){
            navigate("/home");
        }

        //handleChangePlayerList(state.playerList);
        handleGameRoomUpdate();

    }, []);

    

    return (
        <Container>
            <br />
            
            <Grid container spacing={1}>
                <Grid item xs={11}>
                    <Typography sx={{ mb: 2 }} variant="h6" component="div">
                        Players
                    </Typography>
                    <List dense>
                        {
                            playerList.map((player:object)=>{                              
                                const playerObj = Object.values(player)[0];
                                const playerIp = Object.keys(player)[0];
                                return <ListItem key={playerIp}
                                        secondaryAction={
                                            
                                            <></>
                                        }
                                    >
                                    <ListItemIcon>
                                        {playerObj.role === 1 ? <StarsIcon color="error"/> : <AccountCircleIcon />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={gameData.lastWinner===playerIp ?<Box><Typography variant="h6"><EmojiEventsOutlinedIcon color="primary" style={{verticalAlign:"middle"}}/>{playerObj.playerName}</Typography></Box> : playerObj.playerName}
                                        secondary={playerObj.role === 1 ? "Game Master" : "Player"}
                                    />
                                </ListItem>
                                
                            })
                        }

                    </List>
                </Grid>
            </Grid>
        </Container>
        
    );
}