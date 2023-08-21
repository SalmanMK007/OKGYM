import { Container, Typography } from "@mui/material";
import Layout from "../components/layout";

export default function NotFound(props) {
    return (
        <>
            <Layout />
            <Container  maxWidth="md" sx={{
                textAlign: "center",
            }}>
                <Typography component="div" fontSize="2rem">
                    Oops, page not found!
                    Go to  
                    <Typography 
                        component="a"
                        sx={{
                            textDecoration: "none"
                        }}
                        fontSize="2rem"
                        href="/"
                    > main page</Typography>
                </Typography>
            </Container>
        </>
    );
}