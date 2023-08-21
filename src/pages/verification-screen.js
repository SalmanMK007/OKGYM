import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container, Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import axios from "axios";
import Loader from "../components/buttons/loader";
import { format } from 'date-fns'

// NQ
// bezmpk-835892774be5dbff544e194ce39c296a
const VerificationScreen = () => {
    const { uid, token, type } = useParams();
    const [userResponse, setUserResponse] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        const setVerfication = async () => {
            setIsLoading(true)
            try {
                const response = await axios.post(
                    `https://api.artis.app/users/verification/`,
                    { uid, token, type }
                );
                setUserResponse(response.data)
                setIsLoading(false)
            } catch (error) {
                console.error(error)
                setIsError(true)
                setIsLoading(false)
            }
        };
        setVerfication();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container maxWidth="sm">
            <Box ml={3} mr={3} mb={3} mt={10}>
         
               <Box style={{textAlign: 'center'}} m={3} fontSize="1.7rem">
                   <a href="https://artis.app"> <img src="https://artis.app/images/Artis.png" height="40%" width= "40%" alt="Artis Logo"  /> </a>
               </Box>

                <Loader isLoading={isLoading} />
                {isError && 
                    <Typography>Something went wrong!</Typography>
                }
                {type === 'confirm' && userResponse &&
                    <Typography>{userResponse.first_name} {userResponse.last_name} was verified on {format(new Date(userResponse.verification_date), "dd.MM.yyyy")}.</Typography>
                }
                {type === 'deny' && userResponse &&
                    <Typography>{userResponse.first_name} {userResponse.last_name} has been denied verification.</Typography>
                }
            </Box>
        </Container>
    );
};

export default VerificationScreen;
