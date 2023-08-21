import { Box } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CollapsibleBody from "../../../collapsible";

export default function GPSLocation(props) {
    const { location } = props;
    return (
        <CollapsibleBody
            expanded={props.openId === "gps-location-body"}
            id="gps-location-body"
            title={"GPS Location of Registration"}
            icon={<LocationOnIcon />}
            handleClick={props.setOpenId}
            mainSx={{}}
        >
            <Box component="div" >
                {
                    location ? 
                    <>
                        <Box component="div" m={2}>
                            <span>This work was registered at the GPS location: </span>
                            <strong>{`@${location.lat},${location.lng}`}</strong>
                        </Box>
                        <iframe
                            title="GPS Location"
                            width="487" 
                            height="300" 
                            scrolling="no" 
                            frameBorder="0"
                            marginheight="0" 
                            marginwidth="0"
                            allowfullscreen="" 
                            loading="lazy" 
                            referrerpolicy="no-referrer-when-downgrade"
                            src={`https://maps.google.com/maps?q=${location.lat}, ${location.lng}&z=15&output=embed`}
                        >
                        </iframe>
                    </> : <Box component="div" m={3}>No GPS location was included during registration.</Box>
                }
            </Box>
        </CollapsibleBody>
    )
}
