import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import useMobileCheckScreen from '../hooks/isMobile';

export default function ArtisFooter (props) {
    const isMobile = useMobileCheckScreen();
    return (
        <Box
            component="footer"
            sx={{
                fontFamily: "Montserrat, sans-serif",
                color: "blue !important",
                fonrWeight: "normal !important",
                fontSize: isMobile ? "0.8rem" : "1rem",
                textAlign: "center",
               
            }}
        >
             <br />
            <Typography
                sx={{
                    display: "inline-grid",
                    fontFamily: "Montserrat, sans-serif",
                    color: "#607d8b !important",
                    fontSize: isMobile ? "0.8rem" : "1rem",
                }}
            >
                © 2022 ArtisDAO
                

        
            </Typography>
               
            <br />
        
            <Link 
                style={{ 
                    display: "inline-grid",
                    fontFamily: "Montserrat, sans-serif !important",
                    color: "#607d8b !important",
                    fonrWeight: "normal !important",
                    fontSize: isMobile ? "0.8rem" : "1rem",
                  
                    margin: "2%",
                   
                }} 
                to="/terms"
            >
                terms of use
            </Link>
            <Link
                style={{ 
                    
                    textDecoration: "none",
                    fontFamily: "Montserrat, sans-serif !important",
                    color: "#607d8b !important",
                    fonrWeight: "normal !important",
                    margin: "2%",
                    fontSize: isMobile ? "0.8rem" : "1rem",
                }} 
                to="/team"
            >
                team
            </Link>
            <Link 
                  style={{ 
                    textDecoration: "none",
                    fontFamily: "Montserrat, sans-serif !important",
                    color: "#607d8b !important",
                    fonrWeight: "normal !important",
                    margin: "2%",
                    fontSize: isMobile ? "0.8rem" : "1rem",
                }} 
                to="/contact"
            >
                contact
            </Link>
        </Box>
    );
}
