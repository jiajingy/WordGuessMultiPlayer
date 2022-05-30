import * as React from "react";
import { Container, Grid } from "@mui/material";
import sharedStyles from "../../assets/styles/sharedStyles.module.scss";
import homePageStyles from "../../pages/HomePage/HomePageStyles.module.scss";

import NavBar from "../../components/NavBar/NavBar";
import MainGamePanel from "../../components/MainGamePanel/MainGamePanel";

class HomePage extends React.Component {
    render(){
        return (
            <div className={sharedStyles.page}>
                <NavBar />
                <Container >
                    <Grid container spacing={0} alignItems="center" justifyContent="center" direction="column" style={{minHeight:"100vh"}}>
                        <MainGamePanel />
                    </Grid>
                    
                    
                </Container>
            </div>
        );
    }
}

export default HomePage