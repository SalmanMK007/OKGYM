/* eslint-disable jsx-a11y/anchor-is-valid */
import Box from '@mui/material/Box';
import { CloudOutlined } from '@mui/icons-material';
import CollapsibleBody from '../collapsible';
import { Typography } from '@mui/material';

export default function Username(props) {
    return (
        <CollapsibleBody
            expanded={props.openId === "username"}
            id="username"
            title="Your Name"
            icon={<CloudOutlined />}
            handleClick={props.setOpenId}
            mainSx={{
                alignItems: "flex-start",
                //fontFamily: "Bellefair, serif;",
                fontWeight: "normal",
                fontSize: "1.4rem"
            }}
        >
            <Box
                m={4}
                sx={{
                    flexGrow: 1,
                    gridRow: "1",
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                    }}
                >
                    
                  
                    <div className="mb-3">
                        <center>
                            <Box>
                                <Box component="p" display="inline" color="gray" fontSize="1.3rem" >Name: </Box><br />
                                <Box component="span" >{props.name}</Box>
                            </Box>
                         </center>
                    </div>                    
                    <Box 
                        component="div"
                    >
                        <Typography
                            sx={{
                                display: "inline",
                            }}
                            color="green"
                        >
                            Your name is part of the information ARTIS.app records on the blockchain. Since the blockchain is unchangeable, your name here cannot change as otherwise it will not match with the blockchain. <br /> <br />If you need to register works under a different name, please invite yourself to alternative email and open up a new ARTIS.app account.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </CollapsibleBody>
    );
}
