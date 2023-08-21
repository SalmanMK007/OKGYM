import { Button, TextField, Box, Typography, Container } from "@mui/material";
import React, { useState, useEffect } from "react";

export default function EmailInputs(props) {
    const [userEmail, setUserEmail] = useState(props.email);
    const [emails, setEmails] = useState(props.emails);

    useEffect(() => {
        props.onEmailsUpdate(emails.concat(userEmail ? [userEmail] : []) || []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emails]);

    const _handleAddEmail = (event) => {
        setEmails(emails.concat(['']));
    }

    const _handleEmailChange = (i, event) => {
        let copy = [...emails];
        copy[i] = event.target.value;
        setEmails(copy);
    }

    const _handleDeleteEmail = (key) => {
        let copy = [...emails];
        copy.splice(key, 1);
        setEmails(copy);
    }

    return (
        <Container
            maxWidth="md"
        >
            <Box
                component="div"
                sx={{
                    flexGrow: 1,
                    display: 'grid',
                    backgroundSize: "cover",
                    mt: "1%"
                }}
            >
                <TextField
                    variant="standard"
                    style={{textTransform: "none"}}
                    margin="normal"
                    label="Email Address"
                    fullWidth
                    id="email"
                    value={userEmail}
                    InputProps={{
                        style: {
                            fontSize: "1.1rem"
                        }
                    }}
                    onChange={(event) => setUserEmail(event.target.value)}
                    InputLabelProps={{required: false, sx:{color: "#9E9E9E"}}}
                />
                {emails.map((value, i) => {
                    return (
                        <Box
                            display="inline-flex"
                            key={i}
                        >
                            <TextField
                                fullWidth
                                variant="standard"
                                value={value}
                                label="Email Address"
                                onChange={(event) => _handleEmailChange(i, event)}
                                InputLabelProps={{required: false, sx:{color: "#9E9E9E"}}}
                                style={{textTransform: "none"}}
                                InputProps={{
                                    style: {
                                        fontSize: "1.1rem",
                                    }
                                }}
                                sx={{
                                    width: "80%"
                                }}
                                id={`email-${i}`}
                            />
                            <Button 
                                onClick={() => _handleDeleteEmail(i)}
                                style={{
                                    backgroundColor: "transparent",
                                    cursor: "pointer",
                                    border: "none",   
                                }}
                            >
                                <Typography
                                    sx={{
                                        textTransform: "capitalize",
                                        color: "red",
                                        fontSize: "1.2rem",
                                        cursor: "pointer",
                                        mt: 3
                                    }}
                                    >
                                        Remove
                                </Typography>                      
                            </Button>
                        </Box>
                    );
                })}
                <Box
                    component="div"
                    mt={2}
                >
                    <div style={{ textAlign: 'right'}}>
                        <Button
                            style={{
                                backgroundColor: "transparent",
                                cursor: "pointer",
                                border: "none",   
                            }}
                            onClick={_handleAddEmail} 
                            variant="body2"
                        >
                            <Typography
                                sx={{
                                    textTransform: "capitalize",
                                    fontSize: "1.3rem"
                                }}
                            >
                                Add Email
                            </Typography>
                        </Button>
                    </div>
                </Box>
            </Box>
        </Container>
    );
}
