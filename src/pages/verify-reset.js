import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import { Container, Box, CardMedia, Typography } from '@mui/material';
import ArtisInput from '../components/inputs/textfield';
import ArtisButton from '../components/buttons/button';
import { AuthService } from '../api';

export default function VerifyReset(props) {
    const history = useHistory();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { reset_token } = useParams();


    useEffect(() => document.title = "Reset Password | Artis.app", []);
    useEffect(() => {
        setError(password !== confirmPassword);
    }, [confirmPassword, password]);

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError(true);
        }
        const response = await AuthService.verifyReset({token: reset_token, password});
        if (response?.result) history.push('/login');
        else {
            setError(true);
            setErrorMessage(response.error?.response?.data?.password[0] || "Invalid password!");
        };
    }

    return (
        <Container
            maxWidth="sm"
        >
            <Box
                ml={3} mr={3} mb={3}
                component="form"
                onSubmit={ handleResetPassword }
            >
               <CardMedia
                    component="img"
                    style={{width: "40%", paddingTop: "10px", margin: "auto"}}
                    image="/images/Artis.png"
                />
                <Typography
                    mt={3}
                    fontSize="1.4rem"
                    textAlign="center"
                >
                    Glad to see you back.
                </Typography>
                <Typography
                    textAlign="center"
                    fontSize="1.4rem"
                >
                    Enter&nbsp;in&nbsp;your new password below and rejoin&nbsp;the&nbsp;community. :)
                </Typography>
                { error && 
                    <Typography
                        textAlign="center"
                        fontSize="1.4rem"
                        color="error"
                    >
                        { errorMessage || `Password don't match!`}
                    </Typography>
                }
                <Box
                    textAlign="center"
                    mb={3}
                >
                    <ArtisInput
                        value={password}
                        label="Password"
                        id="password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <ArtisInput
                        value={confirmPassword}
                        label="Confirm Password"
                        id="confirm_password"
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <ArtisButton
                        name="Reset Password"
                        size="medium"
                        id="reset_password"
                        sx={{
                            fontSize: "1.5rem",
                        }}
                    />
                </Box>
            </Box>
        </Container>
    );
}
