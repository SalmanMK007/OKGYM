import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect } from "react";
import ArtisFooter from "../components/footer";

export default function Team(props) {
    useEffect(() => {
        document.title = 'Team |';
    }, [])
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
            </Box>
            <Typography 
                component="h1" 
                fontSize="2rem" 
                textAlign="center"
            >
                Founders
            </Typography>
            <Box m={2}>
                <Typography component="h2" fontSize="2rem">
                    Martin Kunert
                </Typography>
                <Typography component="p" >
                    As a filmmaker, Martin worked with every major studio and network in Los Angeles. He directed and written feature films, created reality shows, made feature documentaries, dramatic TV, and independent films, working with companies such as Disney, Paramount, and Warner Brothers. Martin is known for innovative projects like <em>Voices of Iraq</em> and <em>MTV Fear</em>. He is a member of the Directors Guild of America and Writers Guild of America. In recent years, Martin began photographing campaigns and editorials for international fashion brands. His prints were shown in New York City galleries.
                </Typography>
                <br />
                <Typography 
                    component="a" 
                    href="https://en.wikipedia.org/wiki/Martin_Kunert"
                    sx={{
                        textDecoration: "none"
                    }}
                >
                    Martin on wikipedia
                </Typography>
            </Box>
            <Box m={2}>
                <Typography component="h2" fontSize="2rem">
                    Eric Manes
                </Typography>
                <Typography component="p">
                    Eric Manes is a feature film and television writer/producer in Los Angeles. He created numerous films and series including <em>MTV's Fear</em>, in which participants filmed themselves while mastering challenges in the most famously haunted places in the world; feature film <em>3000 Miles to Graceland</em> starring Kevin Costner and Kurt Russell; and documentary <em>Voices of Iraq</em>, for which he funneled digital video cameras to hundreds of Iraqis in the midst of war, allowing unparalleled intimacy and direct access to their stories; and most recently two adventure film franchises for a US-China co-production between Walt Disney Pictures and The Shanghai Media Group. Eric also co-founded with his wife - Coco Suisse, a Swiss Chocolate specialty manufacturing company and chocolate related teaching and media company
                </Typography>
                 <br />
                <Typography 
                    component="a" 
                    href="https://en.wikipedia.org/wiki/Eric_Manes"
                    sx={{
                        textDecoration: "none"
                    }}
                >
                    Eric on wikipedia
                </Typography>
            </Box>
            <br />
            <br />
<Typography 
                component="h2" 
                fontSize="2rem" 
                textAlign="center"
            >
                Code Wizards 

            </Typography>
            <Box m={2}>
                 <Typography component="p">
                    <span color="black">Mensur Bektic</span>: full-stack developer (<a href="https://github.com/MensAaAa">github</a>)
                </Typography>
            </Box>
           
       
            <Box m={2}>
                 <Typography component="p">
                    <span color="black">Andrija Joksimovic</span>: front-end developer (<a href="https://github.com/barskiii">github</a>)
                </Typography>
            </Box>
            <br />
            <br />
            <br />            
            <Box style={{textAlign: 'center'}} m={3} fontSize="1.7rem">           
                <Typography 
                    component="h1" 
                    fontSize="1rem" 
                    textAlign="center"
                >
                     <a href="https://artis.app">Return to top page</a>
                </Typography>
            </Box> 
            <ArtisFooter/>
        </Container>
    );  
}
