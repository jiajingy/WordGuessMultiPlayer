import * as React from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import AbcRoundedIcon from '@mui/icons-material/AbcRounded';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import PasswordIcon from '@mui/icons-material/Password';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BuildIcon from '@mui/icons-material/Build';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarsIcon from '@mui/icons-material/Stars';
import { useLocation, useNavigate } from 'react-router-dom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';


export default function RoomPlayerSection(props: any) {
    

    const navigate = useNavigate();
    const { state } = useLocation() as any;
    let isPageRdyToShow = false;
    isPageRdyToShow = (state===null) ? false : true;

    console.log(state);

    const [playerList, setPlayerList] = React.useState(state.playerList);
    const handleChangePlayerList = (newPlayerList: any) => {
        setPlayerList(newPlayerList);
    }

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
                <Grid item>
                    <Typography sx={{ mb: 2 }} variant="h6" component="div">
                        Players
                    </Typography>
                    <List dense>
                        {
                            playerList.map((player:object)=>{                              
                                const playerObj = Object.values(player)[0];
                                const playerIp = Object.keys(player)[0];
                                return <ListItem key={playerIp}>
                                    <ListItemIcon>
                                        {playerObj.role === 1 ? <StarsIcon color="error"/> : <AccountCircleIcon />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={playerObj.playerName}
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