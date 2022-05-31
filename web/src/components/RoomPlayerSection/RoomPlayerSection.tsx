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
import { useLocation, useNavigate } from 'react-router-dom';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';


export default function RoomPlayerSection(props: any) {
    const navigate = useNavigate();
    const { state } = useLocation() as any;
    let isPageRdyToShow = false;
    isPageRdyToShow = (state===null) ? false : true;

    const handleGameRoomUpdate = () => {
        if (socketService.socket){
            gameService.onGameRoomUpdate(socketService.socket, (newGameRoom) => {
                
            });
        }
    }
    
    React.useEffect(() => {
        // Redirect to home page if no room ID
        // This means user accesses this url directly
        if(!isPageRdyToShow){
            navigate("/home");
        }

        handleGameRoomUpdate();
    }, []);

    const [playerList, setPlayerList] = React.useState([]);
    const handleChangePlayerList = (newPlayerList: any) => {
        setPlayerList(newPlayerList);
    }
    
    console.log(playerList);

    return (
        <Container>
            <br />
            
            <Grid container spacing={1}>
                <Grid item>
                    <Typography sx={{ mb: 2 }} variant="h6" component="div">
                        Players
                    </Typography>
                    <List dense>
                        
                        <ListItem>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Single-line item"
                                secondary="secondray"
                            />
                        </ListItem>
                        
                        <ListItem>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Single-line item"
                                secondary="secondray"
                            />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </Container>
        
    );
}