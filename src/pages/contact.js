import { Box, Container, Typography } from "@mui/material";
import ArtisFooter from "../components/footer";

export default function Contact(props) {
    return (
         <Container
            maxWidth="sm"
            textAlign="center"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                overflow: 'hidden',
                mt: 3
            }}
        >
            <Box style={{textAlign: 'center'}} m={3} fontSize="1.7rem">
                <a href="https://artis.app"> <img src="https://artis.app/images/Artis.png" height="40%" width= "40%" alt="Artis Logo"  /> </a>
            <br />
            <Typography 
                component="h1" 
                fontSize="2rem" 
                textAlign="center"
            >
                Contact
            </Typography> 
            <br />
            <Typography component="p">
                    Artis.app is owned and run by ArtisDAO, a.  distributed autonomous organization.<br /> For inquries, please email < a href="mailto:DAO@artis.app">DAO@artis.app< /a>
                </Typography>
            </Box>
            
         
            <br />
            <br />
            <Box style={{textAlign: 'center'}} m={3} fontSize="1.7rem">           
                <Typography 
                    component="h1" 
                    fontSize="1rem" 
                    textAlign="center"
                >
                     <a href="https://artis.app">Return to top page< /a>
                </Typography>
            </Box> 
            
            <ArtisFooter/>
        </Container>
    );
}
