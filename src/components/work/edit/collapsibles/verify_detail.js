import { useState } from "react";
import Box from "@mui/material/Box";
import VerifyIcon from "@mui/icons-material/NetworkLocked";

import CollapsibleBody from "../../../collapsible";
import ArtisInput from "../../../inputs/textfield";
import { CircularProgress } from "@mui/material";
import utils from "../../../../utils";

export default function VerifyWorkDetail(props) {
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState("");
    const [isMatch, setIsMatch] = useState(false);

    const handleVerify = async (event) => {
        if (event.target.files && event.target.files.length) {
            const formData = new FormData();
            formData.append('work', event.target.files[0]);
            setLoading(true);
            try{
                const match = await props.handleVerify(formData);
                setIsMatch(match);
                setLoading(false);
                setFile(event.target.files[0]?.name);
            } catch(e) {
                setIsMatch(false);
            }
        }
    }

    return (
        <CollapsibleBody
            expanded={props.openId === "verify-body"}
            id="verify-body"
            title={"Verify Original"}
            icon={<VerifyIcon />}
            handleClick={props.setOpenId}
            mainSx={{
                alignItems: "center",
            }}
        >
            <Box component="p" ml={3} mr={3}>
                 <br />
                If the digital fingerprint of the file selected below matches the fingerprint
                recorded on the blockchain, then the files are indentical.
            </Box>

            <Box component="div">
                {file !== "" && (
                    <Box
                        component="div"
                        sx={{
                            m: 3,
                            textAlign: "center",
                            color: isMatch ? "blue" : "red",
                        }}
                    >
                        <Box component="h4">
                            {isMatch ? "VERIFIED" : "NOT VERIFIED"}
                        </Box>
                        <Box component="h6">
                            {
                                isMatch
                                ? "Digital fingerprints MATCH. Files are identical." + utils.formatDate(props?.registeredDate)
                                : "Digital fingerprints DO NOT MATCH. Files are not the same." + utils.formatDate(props?.registeredDate)
                            }
                        </Box>
                    </Box>
                    )
                }
            </Box>

            <Box component="form" ml={3} mr={3}>
                <ArtisInput
                    label="Select file to verify"
                    value={file}
                    onClick={(event) => document.getElementById("verify-file").click()}
                />
                {
                    loading && (
                        <Box textAlign="center" sx={{
                            mb: "2%"
                        }}>
                            <CircularProgress />
                        </Box>
                    )
                }
                <input
                    id="verify-file"
                    type="file"
                    onChange={(event) => handleVerify(event)}
                    style={{display: "none"}}
                />
            </Box>
            <Box
                m={3}
                textAlign={"center"}
            >
            </Box>
        </CollapsibleBody>
    );
}
