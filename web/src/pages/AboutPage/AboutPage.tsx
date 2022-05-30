import * as React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Container, Grid, Stack } from '@mui/material';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';


import sharedStyles from "../../assets/styles/sharedStyles.module.scss";
import aboutPageStyles from "../../pages/HomePage/AboutPageStyles.module.scss";

import NavBar from "../../components/NavBar/NavBar";

import aboutMeImg from "../../assets/images/about_me.png"
import { textTransform } from "@mui/system";

class AboutPage extends React.Component {
    render(){
        return (
            <div className={sharedStyles.page}>
                <NavBar />
                <Container
                    style={{marginTop:"50px"}}
                >
                    <Grid container spacing={0} alignItems="center" justifyContent="center" direction="column">
                        <Grid item xs={12}>
                            <Card sx={{ maxWidth: 545 }}>
                                <CardActionArea>
                                    <CardMedia
                                    component="img"
                                    height="140"
                                    image={aboutMeImg}
                                    alt="green iguana"
                                    />
                                    <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Xinwei (jiajingy)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        I like building apps/games in all types. You can visit my github or provide any feedback to my product!
                                    </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Stack direction="row" spacing={2}>
                                        <Button variant="contained" endIcon={<MailOutlinedIcon />} color="primary" component="a" href={"mailto:" + process.env.REACT_APP_DEV_CONTACT}>
                                            Email {process.env.REACT_APP_DEV_CONTACT}
                                        </Button>
                                        <Button variant="contained" endIcon={<OpenInNewIcon />} color="secondary" component="a" target="_blank" href="https://github.com/jiajingy">
                                            My Github
                                        </Button>
                                    </Stack>
                                    
                                </CardActions>
                            </Card>
                        </Grid>
                        
                    </Grid>
                </Container>
                
            </div>
        );
    }
}

export default AboutPage