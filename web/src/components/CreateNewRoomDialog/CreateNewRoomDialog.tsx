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

    const [playerName, setPlayerName] = React.useState("");
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

    const [creatingNewRoom, setCreatingNewRoom] = React.useState(false)
    
    const handleCreateNewRoom = () => {
        if (playerNameErrorMessage)
            return;
        console.log("creating new room...");
        setCreatingNewRoom(!creatingNewRoom);
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
                    <DialogContentText id="alert-dialog-slide-description">
                        After create room we will display a Room Code for you to share with your friends.
                    </DialogContentText>
                    
                    <br />
                    <FormControl fullWidth>
                        <TextField id="player-name" label="Your Name" placeholder="Player 1" color="success" error={playerName.length>maxPlayerNameLength || playerName.length==0} helperText={playerNameErrorMessage} onChange={(e)=>handlePlayerNameChange(e.target.value)} />
                    </FormControl>
                    <br />
                    <br />
                    
                    <DialogActions>
                        <Button variant="outlined" color="neutral" startIcon={<DoNotDisturbAltOutlinedIcon />} onClick={()=>props.handleDialogOpen()}>Cancel</Button>
                        <LoadingButton variant="outlined" color="success" startIcon={<HomeOutlinedIcon />} onClick={handleCreateNewRoom} loading={creatingNewRoom}>Start New Room!</LoadingButton>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}