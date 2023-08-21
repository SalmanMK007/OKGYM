import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloudOutlined from '@mui/icons-material/CloudOutlined';
import CollapsibleBody from '../collapsible';
import ArtisInput from '../inputs/textfield';
import ArtisButton from '../buttons/button';

export default function DisplayAs(props) {
    // create new state referAs
    const [referAs, setReferAs] = useState(props.referAs || '');

    // write boxed ArtisButton
    return (
        <CollapsibleBody
            expanded={props.openId === "display"}
            id="display"
            title="Customize Creative's Title"
            icon={<CloudOutlined />}
            handleClick={props.setOpenId}
            mainSx={{
                alignItems: "stretch",
                // fontFamily: "Bellefair, sans-serif",
                fontWeight: "normal",
            }}
        >
            <Box m={3} fontSize="1.3rem">
                <Typography> Default term for creative. This can be indivdually overidden on each work.</Typography>
                <Box>
                    <ArtisInput
                        value={referAs}
                        InputLabelProps={{
                            required: false, 
                            sx:{color: "teal"}, 
                            shrink: true
                        }}
                        onChange={(e) => setReferAs(e.target.value)}
                    />
                </Box>
                <Box>
                    <ArtisButton
                        name="Update"
                        type="submit"
                        disabled={ !referAs }
                        textColor="teal"
                        onClick={() => props.updateReferAs(referAs)}
                        sx={{
                            fontSize: "1.5rem",
                            mb: 3
                        }}
                    />
                </Box>
            </Box>
            
        </CollapsibleBody>
    );
}
