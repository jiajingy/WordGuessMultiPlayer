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

const minWordLength = (process.env.REACT_APP_WORD_LENGTH_MIN) ? parseInt(process.env.REACT_APP_WORD_LENGTH_MIN) : 5;
const maxWordLength = (process.env.REACT_APP_WORD_LENGTH_MAX) ? parseInt(process.env.REACT_APP_WORD_LENGTH_MAX) : 7;
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


    // Default to Medium difficulty
    const [difficulty, setDifficulty] = React.useState("2");
    const handleDiffcultyChange = (event: SelectChangeEvent) => {
        setDifficulty(event.target.value as string);
        console.log(difficulty);
    }

    const [wordLength, setWordLength] = React.useState<number | string | Array<number | string>>(
        minWordLength,
    );
    const handleWordLengthSliderChange = (event: Event, newValue: number | number[]) => {
        setWordLength(newValue);
        console.log(wordLength);
    };
    const handleWordLengthInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWordLength((event.target.value) ? minWordLength : Number(event.target.value));
        console.log(wordLength);
    };
    const handleWordLengthBlur = () => {
        if (wordLength < minWordLength) {
            setWordLength(minWordLength);
        } else if (wordLength > maxWordLength) {
            setWordLength(maxWordLength);
        }
    };

    const [mixWord, setMixWord] = React.useState(false);
    const handleMixWord = () => {
        setMixWord(!mixWord);
    }


    const [creatingNewGame, setCreatingNewGame] = React.useState(false)
    
    const handleCreateNewGame = () => {
        console.log("creating new game...");
        setCreatingNewGame(!creatingNewGame);
        const wordLengthSelected = (mixWord) ? "a" : wordLength;
        console.log("Player Name: " + playerName);
        console.log("Difficulty: " + difficulty);
        console.log("Word Length: " + wordLengthSelected);
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
                <TextField id="player-name" label="Your Name" defaultValue="Player 1" color="success" error={playerName.length>maxPlayerNameLength || playerName.length==0} helperText={playerNameErrorMessage} onChange={(e)=>handlePlayerNameChange(e.target.value)} />
            </FormControl>
            <br />
            <br />
            <FormControl fullWidth>
                <InputLabel id="difficulty-label" color="success">Difficulty</InputLabel>
                <Select
                    labelId="difficulty-label"
                    id="difficulty-select"
                    value={difficulty}
                    label="Difficulty"
                    onChange={handleDiffcultyChange}
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
                <Typography id="word-length-slider-label" gutterBottom>
                    Word Length
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                    <AbcRoundedIcon />
                    </Grid>
                    <Grid item xs>
                    <Slider
                        value={typeof wordLength === 'number' ? wordLength : minWordLength}
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
                        value={wordLength}
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
            
            
            <FormControlLabel
                control={<Android12Switch checked={mixWord} onChange={handleMixWord} />}
                label="Mix All Words"
                labelPlacement="start"
                style={{marginLeft:"0px"}}
            />
                
            
            
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" startIcon={<DoNotDisturbAltOutlinedIcon />} onClick={()=>props.handleDialogOpen()}>Cancel</Button>
                <LoadingButton variant="outlined" color="success" startIcon={<HomeOutlinedIcon />} onClick={handleCreateNewGame} loading={creatingNewGame}>Start New Game!</LoadingButton>
            </DialogActions>
        </Dialog>
        </div>
    );
}