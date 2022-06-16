import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import LoadingButton from '@mui/lab/LoadingButton';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';
import publicIp from 'public-ip';
import { internalIpV4 } from 'internal-ip';
import Alert from '@mui/material/Alert';


import gameContext from '../../gameContext';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import RoomGameSettings from '../RoomGameSettings/RoomGameSettings';



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const maxPlayerNameLength = (process.env.REACT_APP_PLAYER_NAME_LENGTH_MAX) ? parseInt(process.env.REACT_APP_PLAYER_NAME_LENGTH_MAX) : 20;

export default function CreateNewRoomDialog(props: any) {
    const {
        isInRoom,
        setInRoom,
        ipAddr
    } = React.useContext(gameContext);

    const navigate = useNavigate();
    const goToGameRoomPage = (roomCode: any, internalRoomId: any, gameSettings: any, playerList: any) => navigate("/" + roomCode, {state:{roomCode:roomCode, internalRoomId: internalRoomId, gameSettings: gameSettings, playerList:playerList}});

    const [playerName, setPlayerName] = React.useState("");
    const [playerNameErrorMessage, setPlayerNameErrorMessage] = React.useState("");
    const handlePlayerNameChange = (newValue: string) => {
        setPlayerName(newValue);
    }

    const[showAlert, setShowAlert] = React.useState(false);
    const handleSetShowAlert = (newValue:boolean)=>{
        setShowAlert(newValue);
    }
    const[alertContent, setAlertContent] = React.useState("");
    const handleSetAlertContent = (newValue:string)=>{
        setAlertContent(newValue);
    }

    React.useEffect(()=> {
        if (!playerName || playerName.length===0){
            setPlayerNameErrorMessage("Player name cannot be empty");
        }
        else if (playerName.length > maxPlayerNameLength){
            setPlayerNameErrorMessage("Player name has to be under " + maxPlayerNameLength + " characters");
        }
        
    }, [playerName])

    React.useEffect(() => {
        if (playerName.length!==0 && playerName.length <= maxPlayerNameLength && playerNameErrorMessage) {
            setPlayerNameErrorMessage("");
        }
    }, [playerName, playerNameErrorMessage]);

    const [creatingNewRoom, setCreatingNewRoom] = React.useState(false)
    
    const handleCreateNewRoom = async () => {
        if (playerNameErrorMessage)
            return;
        

        const socket = socketService.socket;
        if (!socket)
            return;

        console.log(socket.id);

        console.log("creating new room...");
        setCreatingNewRoom(true);
        handleSetShowAlert(false);

        const createGameRoomResult = await gameService.CreateGameRoom(socket, playerName, ipAddr).catch((err)=>{
            handleSetAlertContent("Cannot create room, something wrong with game server.");
            handleSetShowAlert(true);
            setCreatingNewRoom(false);
            return;
        });

        if(createGameRoomResult){
            setCreatingNewRoom(false);
            console.log(createGameRoomResult.roomCode);
            
            goToGameRoomPage(
                createGameRoomResult.roomCode,
                createGameRoomResult.internalRoomId,
                createGameRoomResult.gameSettings,
                createGameRoomResult.playerList
            );        
        }

    }
   

    return (
        <div>
            
            <Dialog
                open={props.dialogOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={()=>props.handleDialogOpen()}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Create New Game Room"}</DialogTitle>
                <DialogContent>
                    {showAlert ? <Alert severity="error">{alertContent}</Alert> : <></> }
                    <DialogContentText id="alert-dialog-slide-description">
                        After create room we will display a Room Code for you to share with your friends.
                    </DialogContentText>
                    
                    <br />
                    <FormControl fullWidth>
                        <TextField id="player-name" label="Your Name" placeholder="Player 1" color="success" error={playerName.length>maxPlayerNameLength || playerName.length===0} helperText={playerNameErrorMessage} onChange={(e)=>handlePlayerNameChange(e.target.value)} />
                    </FormControl>
                    <br />
                    <br />
                    
                    <DialogActions>
                        <Button variant="outlined" color="neutral" startIcon={<DoNotDisturbAltOutlinedIcon />} onClick={()=>props.handleDialogOpen()}>Cancel</Button>
                        <LoadingButton variant="outlined" color="success" startIcon={<HomeOutlinedIcon />} onClick={handleCreateNewRoom} loading={creatingNewRoom}>Create Room!</LoadingButton>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}