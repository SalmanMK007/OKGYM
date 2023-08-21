import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container, Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import axios from "axios";
import Loader from "../components/buttons/loader";

// NQ
// bezmpk-835892774be5dbff544e194ce39c296a
const FameScreen = () => {
    const { uid, token, type } = useParams();
    const [userResponse, setUserResponse] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        const setVerfication = async () => {
            setIsLoading(true)
            try {
                const response = await axios.post(
                    `https://api.artis.app/fame/status/`,
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
                    <Typography>Thank you for joining the creative community of {userResponse.first_name} {userResponse.last_name}.  In
                    the future, if you wish to remove yourself, do so on your
                    Community page</Typography>
                }
                {type === 'deny' && userResponse &&
                    <Typography>You have declined to join in a creative community with {userResponse.first_name} {userResponse.last_name}</Typography>
                }
            </Box>
        </Container>
    );
};

export default FameScreen;
