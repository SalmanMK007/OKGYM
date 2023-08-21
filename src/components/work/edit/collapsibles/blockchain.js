import { Box } from "@mui/material";
import Fingerprint from "@mui/icons-material/Fingerprint";
import { TextField } from "@mui/material";
import CollapsibleBody from "../../../collapsible";


export default function Blockchain(props) {
    return (
        <CollapsibleBody
            expanded={props.openId === "blockchain-body"}
            id="blockchain-body"
            title={"Blockchain"}
            icon={<Fingerprint />}
            handleClick={props.setOpenId}
            mainSx={{}}
        >
            <Box
                component="div"
                m={3}
            >
                The location where your copyright has been recorded on the blockchain can be viewed                 
                <strong><a 
                    style={{textDecoration: "none"}} 
                    href={`https://polygonscan.com/tx/${props?.tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                > here. </a></strong>
                    <br />
                    <br />
                    Scroll down page and select 'Click to see More'. 
                    When the page expands, scrolls down to the Input Data field. 
                    Set 'View Input as' to 'UTF-8'. This reveals your 
                    registration information as it is stored on the blockchain.
   
                <br />
                <br />
              
                    Your work's unique digital fingerprint is:
                <TextField
                    variant="outlined"
                    defaultValue={props?.work_copy_fingerprint}
                    sx={{
                        m: 3,
                        whiteSpace: "pre-wrap",
                        width: "90%",
                    }}
                />
                {(props?.sold_tx_hash && props?.sold_tx_hash !== "0") && (
                    <>
                        <br/>
                        <br/>
                            The Sale of this work can be viewed on the blockchain 
                        <a 
                            style={{textDecoration: "none"}} 
                            href={`https://polygonscan.com/tx/${props?.sold_tx_hash}`}
                            target="_blank"
                            rel="noreferrer"
                        > here.</a>
                    </>
                ) }
               
            </Box>
        </CollapsibleBody>
    );
}
