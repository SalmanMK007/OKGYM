import React, { useState } from "react";
import { Box, Container, Grid, Collapse } from "@mui/material";
import ReactPlayer from "react-player";
import ExpandButton from "../components/work/expand-more";
import HelpIcon from '@mui/icons-material/Help';
import CopyrightIcon from '@mui/icons-material/Copyright';
import TagsIcon from "@mui/icons-material/Loyalty";
import SellIcon from '@mui/icons-material/Sell';

export default function Help() {
    const [openId, setOpenId] = useState("");

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "background.paper",
                    overflow: "hidden",
                    boxShadow: 1,
                    fontWeight: "bold",
                    mb: 5,
                    pb: 3,
                    mt: 5,
                    pt: 3,
                }}
            >
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        overflow: "hidden",
                        boxShadow: 4,
                        p: 1,
                        borderBottom: "1px solid #ddd",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "15px",
                        fontWeight: "normal",
                        lineHeight: "1.5",
                        alignItems: "flex-start",
                        margin: "0px 24px 0px 24px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => openId === 1 ? setOpenId("") : setOpenId(1)}
                    >
                        <Grid direction={"row"} container>
                            <Grid item>
                                <ExpandButton
                                    title={"Why Artis.app is the best to protect your art?"}
                                    id={1}
                                    handleClick={() => setOpenId(1)}
                                    expanded={openId === 1}
                                >
                                    <HelpIcon />
                                </ExpandButton>
                            </Grid>
                        </Grid>
                    </Box>
                    <Collapse
                        in={openId === 1}
                        timeout="auto"
                        unmountOnExit
                    >
                        <div 
                            style={{ 
                                display: "flex", 
                                flexDirection: "row", 
                                justifyContent: "center",
                                margin: "20px 0px 20px 0px",
                            }}>
                            <ReactPlayer
                                url="https://player.vimeo.com/video/751697323?h=9ea43f53f7"
                                controls
                                style={{ boxShadow: "1px 2px 5px #AAAAAA" }}
                                width="380px"
                                height="380px"
                                autoplay
                                pip
                            />
                        </div>
                    </Collapse>
                </Box>
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        overflow: "hidden",
                        boxShadow: 4,
                        p: 1,
                        borderBottom: "1px solid #ddd",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "15px",
                        fontWeight: "normal",
                        lineHeight: "1.5",
                        alignItems: "flex-start",
                        margin: "0px 24px 0px 24px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => openId === 2 ? setOpenId("") : setOpenId(2)}
                    >
                        <Grid direction={"row"} container>
                            <Grid item>
                                <ExpandButton
                                    title={"What is the Copyright Registration Email"}
                                    id={2}
                                    handleClick={() => setOpenId(2)}
                                    expanded={openId === 2}
                                >
                                    <CopyrightIcon />
                                </ExpandButton>
                            </Grid>
                        </Grid>
                    </Box>
                    <Collapse
                        in={openId === 2}
                        timeout="auto"
                        unmountOnExit
                    >
                        <div 
                            style={{ 
                                display: "flex", 
                                flexDirection: "row", 
                                justifyContent: "center",
                                margin: "20px 0px 20px 0px",
                            }}>
                            <ReactPlayer
                                url="https://vimeo.com/753641944/2730593700"
                                controls
                                style={{ boxShadow: "1px 2px 5px #AAAAAA" }}
                                width="380px"
                                height="380px"
                                autoplay
                                pip
                            />
                        </div>
                    </Collapse>
                </Box>
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        overflow: "hidden",
                        boxShadow: 4,
                        p: 1,
                        borderBottom: "1px solid #ddd",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "15px",
                        fontWeight: "normal",
                        lineHeight: "1.5",
                        alignItems: "flex-start",
                        margin: "0px 24px 0px 24px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => openId === 3 ? setOpenId("") : setOpenId(3)}
                    >
                        <Grid direction={"row"} container>
                            <Grid item>
                                <ExpandButton
                                    title={"How to Sell My Work"}
                                    id={3}
                                    handleClick={() => setOpenId(3)}
                                    expanded={openId === 3}
                                >
                                    <SellIcon />
                                </ExpandButton>
                            </Grid>
                        </Grid>
                    </Box>
                    <Collapse
                        in={openId === 3}
                        timeout="auto"
                        unmountOnExit
                    >
                        <div 
                            style={{ 
                                display: "flex", 
                                flexDirection: "row", 
                                justifyContent: "center",
                                margin: "20px 0px 20px 0px",
                            }}>
                            <ReactPlayer
                                url="https://player.vimeo.com/video/769159375?h=38198d3f37"
                                controls
                                style={{ boxShadow: "1px 2px 5px #AAAAAA" }}
                                width="380px"
                                height="380px"
                                autoplay
                                pip
                            />
                        </div>
                    </Collapse>
                </Box>
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        overflow: "hidden",
                        boxShadow: 4,
                        p: 1,
                        borderBottom: "1px solid #ddd",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "15px",
                        fontWeight: "normal",
                        lineHeight: "1.5",
                        alignItems: "flex-start",
                        margin: "0px 24px 0px 24px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => openId === 4 ? setOpenId("") : setOpenId(4)}
                    >
                        <Grid direction={"row"} container>
                            <Grid item>
                                <ExpandButton
                                    title={"How Search Tags work"}
                                    id={4}
                                    handleClick={() => setOpenId(4)}
                                    expanded={openId === 4}
                                >
                                    <TagsIcon />
                                </ExpandButton>
                            </Grid>
                        </Grid>
                    </Box>
                    <Collapse
                        in={openId === 4}
                        timeout="auto"
                        unmountOnExit
                    >
                        <div 
                            style={{ 
                                display: "flex", 
                                flexDirection: "row", 
                                justifyContent: "center",
                                margin: "20px 0px 20px 0px",
                            }}>
                            <ReactPlayer
                                url="https://player.vimeo.com/video/769952597?h=089ae54b99"
                                controls
                                style={{ boxShadow: "1px 2px 5px #AAAAAA" }}
                                width="380px"
                                height="380px"
                                autoplay
                                pip
                            />
                        </div>
                    </Collapse>
                </Box>
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        overflow: "hidden",
                        boxShadow: 4,
                        p: 1,
                        borderBottom: "1px solid #ddd",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "15px",
                        fontWeight: "normal",
                        lineHeight: "1.5",
                        alignItems: "flex-start",
                        margin: "0px 24px 0px 24px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => openId === 5 ? setOpenId("") : setOpenId(5)}
                    >
                        <Grid direction={"row"} container>
                            <Grid item>
                                <ExpandButton
                                    title={"How QR Codes work"}
                                    id={5}
                                    handleClick={() => setOpenId(5)}
                                    expanded={openId === 5}
                                >
                                    <CopyrightIcon />
                                </ExpandButton>
                            </Grid>
                        </Grid>
                    </Box>
                    <Collapse
                        in={openId === 5}
                        timeout="auto"
                        unmountOnExit
                    >
                        <div 
                            style={{ 
                                display: "flex", 
                                flexDirection: "row", 
                                justifyContent: "center",
                                margin: "20px 0px 20px 0px",
                            }}>
                            <ReactPlayer
                                url="https://player.vimeo.com/video/755622176?h=1b0c5ce2f4"
                                controls
                                style={{ boxShadow: "1px 2px 5px #AAAAAA" }}
                                width="380px"
                                height="380px"
                                autoplay
                                pip
                            />
                        </div>
                    </Collapse>
                </Box>
            </Box>
        </Container>
    )
}
