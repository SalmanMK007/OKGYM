import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';

export default function ConfirmSuccess(props) {
    return (
        <Box
            alignItems="center"
            textAlign="center"
        >
            <Container
                maxWidth="sm"
            >
            <CardMedia
                component="img"
                style={{width: "40%", paddingTop: "10px", margin: "auto"}}
                image="/images/Artis.png"
            />
            <Typography
                variant="h4"
                m={3}
                style={{textAlign: "center"}}
            >
                You confirmed your email!! Nice!
            </Typography>
            <Box textAlign="center">
                <a href="/login">Click here and Let's Get started</a>
            </Box>
            </Container>
        </Box>
    );
}
