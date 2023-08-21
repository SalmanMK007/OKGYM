import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

export default function ConfirmEmail(props) {
    const handleConfirm = async () => {

    }

    return (
        <Container
            maxWidth="sm"
            m={5}
            alignItems="center"
        >
            <CardMedia
                component="img"
                style={{width: "40%", paddingTop: "10px", margin: "auto"}}
                image="/images/Artis.png"
            />
            <Typography
                fontSize="1.5rem"
            >
                Account not confirmed!
            </Typography>
            <Typography
                fontSize="1.5rem"
            >
                Check your email box for an email from us.
            </Typography>
            <Typography
                fontSize="1.5rem"
            >
                If you haven't received the confirmation email,
                <Button onClick={handleConfirm}>
                    here
                </Button>
            </Typography>
        </Container>
    );
}
