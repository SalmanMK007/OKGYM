import Refresh from "@mui/icons-material/Refresh";
import { FormControlLabel, FormGroup, Box, Checkbox } from "@mui/material";
import CollapsibleBody from "../../../collapsible";
import { useState } from "react";
import ArtisInput from "../../../inputs/textfield";
import ArtisButton from "../../../buttons/button";
import InfoDialog from "../../../dialogs/info-dialog";
import Loader from '../../../buttons/loader';

export default function Customize(props) {
    const [artistType, setArtistType] = useState(props.artist_type);
    const [hideInfo, setHideInfo] = useState(Boolean(props.hide_info));

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const updated = await props.updateArtistType(
            {
                artist_type: artistType,
                hide_artist_info: hideInfo,
            }
        );
        setArtistType(updated.artist_type);
        setHideInfo(updated.hide_artist_info);
        setIsLoading(false);
    }

    return (
        <CollapsibleBody
            expanded={props.openId === "customize-body"}
            id="customize-body"
            title={"Customize"}
            icon={<Refresh />}
            handleClick={props.setOpenId}
            mainSx={{}}
        >
            <Box
                component="form"
                ml={4}
                mr={4}
                onSubmit={ handleSubmit }
            >
                <Box
                    component="div"
                    mb={1}
                >
                    <Box display="inline-grid">
                        <br />
                        On the Proof of Copyright Registration, refer to this work's creator as:
                    </Box>
                    <Box display="inline-grid">
                        <InfoDialog
                            title=" Refer to Creator as:"
                            subtitle=""
                            examples={[
                                "Artist",
                                "Painter",
                                "Writer",
                                "Painter",
                                "Composer"
                            ]}
                        />
                    </Box>
                </Box>
                   
                <ArtisInput
                    value={artistType}
                    label="Artist Type"
                    id="artist_type"
                    onChange={(e) => setArtistType(e.target.value)}
                    sx={{
                        mb: 4,
                    }}
                    fontSize="1.2rem"
                />
                <FormGroup>
                    <FormControlLabel 
                        control={<Checkbox onChange={(e) => setHideInfo(!hideInfo)} checked={hideInfo} />} 
                        label={
                            <Box component="p" fontStyle="italic">
                                Hide {artistType} Bio, Website, and Photo on Proof of Copyright Registration.
                            </Box>
                        }
                    />
                </FormGroup>
                <Loader isLoading={isLoading}/>
                <ArtisButton
                    name="Update"
                    size="medium"
                    id="update_pref"
                    sx={{
                        fontSize: "1.5rem",
                        mb: 3,
                    }}
                />
            </Box>
        </CollapsibleBody>
    );
}
