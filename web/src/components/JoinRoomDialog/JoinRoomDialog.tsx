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


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Input = styled(MuiInput)`
  width: 42px;
`;

const maxPlayerNameLength = (process.env.REACT_APP_PLAYER_NAME_LENGTH_MAX) ? parseInt(process.env.REACT_APP_PLAYER_NAME_LENGTH_MAX) : 20;

export default function CreateNewRoomDialog(props: any) {

    const [playerName, setPlayerName] = React.useState("Player 1");
    const [playerNameErrorMessage, setPlayerNameErrorMessage] = React.useState("");
    const handlePlayerNameChange = (newValue: string) => {
        setPlayerName(newValue);
    }

    React.useEffect(()=> {
        if (!playerName || playerName.length==0){
            setPlayerNameErrorMessage("Player name cannot be empty");
        }
        else if (playerName.length > maxPlayerNameLength){
            setPlayerNameErrorMessage("Player name has to be under " + maxPlayerNameLength + " characters");
        }
        
    }, [playerName])

    React.useEffect(() => {
        if (playerName.length!=0 && playerName.length <= maxPlayerNameLength && playerNameErrorMessage) {
            setPlayerNameErrorMessage("");
        }
    }, [playerName, playerNameErrorMessage]);


    const [roomCode, setRoomCode] = React.useState("ex. E8H4");
    const [roomCodeErrorMessage, setRoomCodeErrorMessage] = React.useState("");
    React.useEffect(()=> {
        if (!roomCode || roomCode.length!=4){
            setRoomCodeErrorMessage("Room Code is 4 characters");
        }
    }, [roomCode])

    React.useEffect(() => {
        if (roomCode.length!=4 && playerNameErrorMessage) {
            setPlayerNameErrorMessage("");
        }
    }, [roomCode, roomCodeErrorMessage]);
    const handleRoomCodeChange = (newValue: string) => {
        setRoomCode(newValue);
    }

    
    const [joiningRoom, setJoiningRoom] = React.useState(false)
    
    const handleJoinRoom = () => {
        console.log("joining room: " + roomCode);
        setJoiningRoom(!joiningRoom);
        
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
            <DialogTitle>{"Join Game Room"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Join a room that has been created.
            </DialogContentText>
            
            <br />
            <FormControl fullWidth>
                <TextField id="player-name" label="Your Name" defaultValue="Player 1" color="success" error={playerName.length>maxPlayerNameLength || playerName.length==0} helperText={playerNameErrorMessage} onChange={(e)=>handlePlayerNameChange(e.target.value)} />
            </FormControl>
            <br />
            <br />
            <FormControl fullWidth>
                <TextField id="room-code" label="Room Code" defaultValue="ex. E8H4" color="success" error={roomCode.length!=4} helperText={roomCodeErrorMessage} onChange={(e)=>handleRoomCodeChange(e.target.value)} />
            </FormControl>
            <br />
            <br />
            
            
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" startIcon={<DoNotDisturbAltOutlinedIcon />} onClick={()=>props.handleDialogOpen()}>Cancel</Button>
                <LoadingButton variant="outlined" color="success" startIcon={<HomeOutlinedIcon />} onClick={handleCreateNewGame} loading={creatingNewGame}>Join Room!</LoadingButton>
            </DialogActions>
        </Dialog>
        </div>
    );
}