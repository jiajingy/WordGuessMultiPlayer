import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Grid, Paper, Stack } from "@mui/material";
import guesswordImg from "../../assets/images/guessword.png";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';

import CreateNewRoomDialog from "../CreateNewRoomDialog/CreateNewRoomDialog";
import JoinRoomDialog from "../JoinRoomDialog/JoinRoomDialog";


const MainGamePanel = () => {

    const [createNewRoomDialogIsOpen, setCreateNewRoomDialogIsOpen] = React.useState(false);
    const [joinRoomDialogIsOpen, setJoinRoomDialogIsOpen] = React.useState(false);

    const handleCreateNewRoomDialog = () => {
        setCreateNewRoomDialogIsOpen(!createNewRoomDialogIsOpen);
    };

    const handleJoinRoomDialog = () => {
        setJoinRoomDialogIsOpen(!joinRoomDialogIsOpen);
    }

    return (
      
      <Grid item xs={12}>
          <Paper elevation={3}>
              <Box component="img" alt="Guess Word Image" src={guesswordImg} sx={{maxWidth:"100%"}} style={{margin:"0"}} alignItems="center" justifyContent="center"/>
              <Typography variant="h6" align="center">
                    Mutiplayer Game!
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                    Report bug or provide feedback to {process.env.REACT_APP_DEV_CONTACT}
              </Typography>
              <Box sx={{pt:5,pb:5}}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <Button variant="contained" startIcon={<HomeOutlinedIcon />} color="success" sx={{fontWeight: "bold"}} onClick={()=>handleCreateNewRoomDialog()}>
                            Create New Game Room
                        </Button>
                        <Button variant="contained" startIcon={<EmojiPeopleRoundedIcon />} color="primary" sx={{fontWeight: "bold"}} onClick={()=>handleJoinRoomDialog()}>
                            Join Room
                        </Button>
                </Stack>
               </Box>
          </Paper>

          <CreateNewRoomDialog handleDialogOpen={()=>handleCreateNewRoomDialog()} dialogOpen={createNewRoomDialogIsOpen} />

          <JoinRoomDialog handleDialogOpen={()=>handleJoinRoomDialog()} dialogOpen={joinRoomDialogIsOpen} />
      </Grid>
    
    );
};
export default MainGamePanel;