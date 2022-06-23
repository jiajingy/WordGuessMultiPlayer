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
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import gameContext from '../../gameContext';
import gameService from '../../services/gameService';
import publicIp from 'public-ip';
import { internalIpV4 } from 'internal-ip';
import socketService from '../../services/socketService';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { InputAdornment, TextField } from '@mui/material';


const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&:before, &:after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
      },
      '&:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&:after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
  }));

const Input = styled(MuiInput)`
  width: 42px;
`;

const minWordLength = (process.env.REACT_APP_WORD_LENGTH_MIN) ? parseInt(process.env.REACT_APP_WORD_LENGTH_MIN) : 5;
const maxWordLength = (process.env.REACT_APP_WORD_LENGTH_MAX) ? parseInt(process.env.REACT_APP_WORD_LENGTH_MAX) : 7;

export default function RoomGameSettings(props: any) {

    const {
        isInRoom,
        setInRoom,
        ipAddr
    } = React.useContext(gameContext);


    const navigate = useNavigate();
    const goToHomePage = () => navigate("/");
    let isPageRdyToShow = false;

    const { state } = useLocation() as any;
    
    isPageRdyToShow = (state===null) ? false : true;

    const difficultyTranslate = (val: string) => {
        switch (val){
            case "1": return "Easy";
            case "2": return "Medium";
            case "3": return "Hard";
            default: return "Error";
        }
    }
    const [difficulty, setDifficulty] = React.useState("2");
    const handleDifficultyChange = async (event: SelectChangeEvent) =>{
        setDifficulty(event.target.value as string);
        gameSettings.difficulty = event.target.value as string;
        console.log("game new diff: ", gameSettings.difficulty);

        const socket = socketService.socket;
        if (!socket)
            return;


        const updateGameRoom = await gameService.UpdateGameRoomSettings(socket, state.roomCode, gameSettings).catch((err)=>{
            handleSetAlertContent("Cannot update room...something is wrong");
            handleSetShowAlert(true);
        });

        console.log("new update from server: ", gameSettings.difficulty);
        console.log(gameSettings.difficulty);
    };
    
    const handleDiffcultyChange = (event: SelectChangeEvent) => {
        gameSettings.difficulty = event.target.value as string;
        setGameSettings(gameSettings);
        console.log("change diff to: ", gameSettings.difficulty);
    };


    const handleWordLengthSliderChange = (event: Event, newValue: number | number[]) => {
        gameSettings.wordLength = newValue;
        console.log("slider change: ", gameSettings.wordLength);
    };
    const handleWordLengthInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        gameSettings.wordLength = (event.target.value) ? minWordLength : Number(event.target.value);
        console.log("length input change: ", gameSettings.wordLength);
    };
    const handleWordLengthBlur = () => {
        if ( gameSettings.wordLength < minWordLength) {
            gameSettings.wordLength = minWordLength;
        } else if ( gameSettings.wordLength > maxWordLength) {
            gameSettings.wordLength = maxWordLength;
        }
    };

    const [mixWord, setMixWord] = React.useState(false);
    const handleMixWord = () => {
        setMixWord(!mixWord);
        gameSettings.wordLength = "a";
    }

    const [canStartGame, setCanStartGame] = React.useState(true);
    const [creatingNewGame, setCreatingNewGame] = React.useState(false)
    
    const handleCreateNewGame = () => {
        console.log("creating new game...");
        setCreatingNewGame(!creatingNewGame);
        gameSettings.wordLength = (mixWord) ? "a" : gameSettings.wordLength;
        //console.log("Difficulty: " + difficulty);
        console.log("Word Length final: " + gameSettings.wordLength);
    }

    const[showAlert, setShowAlert] = React.useState(false);
    const handleSetShowAlert = (newValue:boolean)=>{
        setShowAlert(newValue);
    }
    const[alertContent, setAlertContent] = React.useState("");
    const handleSetAlertContent = (newValue:string)=>{
        setAlertContent(newValue);
    }

    const [canLeaveRoom, setCanLeaveRoom] = React.useState(true);
    const [leavingRoom, setLeavingRoom] = React.useState(false)
    const handleCanLeaveRoom = async () => {
        const socket = socketService.socket;
        if (!socket)
            return;
        const publicIpAddr = await publicIp.v4();
        const internalIpAddr = await internalIpV4();
        const ipAddr = publicIpAddr + "-" + internalIpAddr;

        console.log("leaving room");
        setLeavingRoom(true);
        // no need to wait
        // let game server process
        // we direct user back to homepage
        const leaveGameRoomResult = gameService.LeaveGameRoom(socket, ipAddr).catch((err)=>{
            handleSetAlertContent("Cannot leave room...something is wrong");
            handleSetShowAlert(true);
            setLeavingRoom(false);
        });

        goToHomePage();
        
    }

    const [gameSettings, setGameSettings] = React.useState(state.gameSettings);
    const handleChangeGameSettings= (newGameSettings: any) => {
        setGameSettings(newGameSettings);
    }

    const [amIGameMaster, setAmIGameMaster] = React.useState(false)
    const handleAmIGameMaster = (newPlayerList: any) =>{
        let result = false;
        for(const idx in newPlayerList){
            const ip = Object.keys(newPlayerList[idx])[0];
            console.log(ip);
            console.log(newPlayerList[idx]);
            if (ip === ipAddr && newPlayerList[idx][ip] !==undefined && newPlayerList[idx][ip]["role"] === 1)
                result = true;
        }
        console.log("am i game master: ", result);
        setAmIGameMaster(result);
    }

    const [playerList, setPlayerList] = React.useState(state.playerList);
    const handleChangePlayerList = (newPlayerList: any) => {
        setPlayerList(newPlayerList);
    }

    const handleGameRoomUpdate = () => {
        if (socketService.socket){
            gameService.onGameRoomUpdate(socketService.socket, (newGameRoom:any) => {
                console.log("enteredOngameroomupdate");
                console.log(newGameRoom);
                handleChangeGameSettings(newGameRoom.gameSettings);
                handleChangePlayerList(newGameRoom.playerList);
                handleAmIGameMaster(playerList);
            });
        }
    }



    // Redirect to home page if no room ID
    // This means user accesses this url directly
    React.useEffect(() => {
        if(!isPageRdyToShow){
            navigate("/home");
        }

        handleGameRoomUpdate();

    }, []);

    
    

    return (
        <Container>
            
            {showAlert ? <div><br /><Alert severity="error">{alertContent}</Alert></div> : <></> }
            <br />
            <Typography component="h2" variant="h5" >Room <Chip label={isPageRdyToShow?state.roomCode:"(no available room)"} color="success" size="small" icon={<HomeOutlinedIcon />} variant="outlined" /></Typography>
            <br />
            <Divider>Settings</Divider>
            <br />
            {
                amIGameMaster ?
                // Game Master View
                <div>
                    <FormControl fullWidth>
    
                        <Tooltip placement="top" title="The difficulty means how many percentage of number of letters will be hidden from the word. You will need to fill in more letters if you pick harder difficulty.">
                            <InputLabel id="difficulty-label" color="success">Difficulty</InputLabel>
                        </Tooltip>
                        

                            <Select
                                labelId="difficulty-label"
                                id="difficulty-select"
                                value={difficulty}
                                label="Difficulty"
                                onChange={handleDifficultyChange}
                                color="success"
                                >
                                <MenuItem value={"1"}>Easy</MenuItem>
                                <MenuItem value={"2"}>Medium</MenuItem>
                                <MenuItem value={"3"}>Hard</MenuItem>
                            </Select>
                    </FormControl>
                    <br />
                    <br />
                    <Box sx={{ width: 250 }}>
                        <Typography variant="body2" id="word-length-slider-label" gutterBottom>
                            Word Length
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                            <AbcRoundedIcon />
                            </Grid>
                            <Grid item xs>
                            <Slider
                                value={typeof gameSettings.wordLength === 'number' ? gameSettings.wordLength : minWordLength}
                                onChange={handleWordLengthSliderChange}
                                aria-labelledby="word-length-slider-label"
                                step={1}
                                min={minWordLength}
                                max={maxWordLength}
                                disabled={mixWord}
                            />
                            </Grid>
                            <Grid item>
                            <Input
                                value={gameSettings.wordLength}
                                size="small"
                                onChange={handleWordLengthInputChange}
                                onBlur={handleWordLengthBlur}
                                disabled={mixWord}
                                inputProps={{
                                    step: 1,
                                    min: {minWordLength},
                                    max: {maxWordLength},
                                    type: 'number',
                                    'aria-labelledby': 'word-length-slider-label',
                                }}
                            />
                            </Grid>
                        </Grid>
                    </Box>
                    
                    <br />
                    <FormControlLabel
                        control={<Android12Switch checked={mixWord} onChange={handleMixWord} />}
                        label={<Typography variant="body2">Mix All Words</Typography>}
                        labelPlacement="start"
                        style={{marginLeft:"0px"}}
                    />
                </div>
                :
                // Player View
                <div>
                    <Box sx={{width: 500, maxWidth:"100%"}}>
                        <FormControl variant="standard" fullWidth>
                            <Tooltip placement="top" title="The difficulty means how many percentage of number of letters will be hidden from the word. You will need to fill in more letters if you pick harder difficulty.">
                                <TextField aria-readonly fullWidth label="Difficulty" value={difficultyTranslate(gameSettings.difficulty)}/>
                            </Tooltip>
                        </FormControl>
                    </Box>
                    
                    <br />
                </div>
            }
            


            <Divider></Divider>
            <br />
                
            <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                <Stack direction="row" spacing={2}>
                    <LoadingButton variant="contained" color="error" startIcon={<LogoutIcon />} disabled={!canLeaveRoom || creatingNewGame} onClick={handleCanLeaveRoom} loading={leavingRoom}>Leave Room</LoadingButton>
                    <LoadingButton variant="contained" color="success" startIcon={<FingerprintIcon />} disabled={!canStartGame || leavingRoom} onClick={handleCreateNewGame} loading={creatingNewGame}>Start Game!</LoadingButton>
                </Stack>
            </Box>
            <br />
        </Container>
        
    );
}