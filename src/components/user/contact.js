import { CloudOutlined } from '@mui/icons-material';
// import Grid and Box from @mui/material
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {useState} from 'react';
import CollapsibleBody from '../collapsible';
import ArtisButton from '../buttons/button';
import ArtisInput from '../inputs/textfield';
import Loader from '../buttons/loader';
import CountrySelect from '../country-select';

export default function ContactInfo(props) {
    // for all the states if the initial value is null then set it to empty string
    const [country, setCountry] = useState(props.country || '');
    const [city, setCity] = useState(props.city || '');
    const [street1, setStreet1] = useState(props.street1 || '');
    const [street2, setStreet2] = useState(props.street2 || '');
    const [zip, setZip] = useState(props.zip || '');
    const [state, setState] = useState(props.state || '');
    const [phone, setPhone] = useState(props.phone || '');
    const [website, setWebsite] = useState(props.website || '');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        // call handleContactInfoUpdate from props with the state values combined into one object
        await props.handleContactInfoUpdate({
            country,
            city,
            street_1: street1,
            street_2: street2,
            zip_code: zip,
            state,
            phone_number: phone,
            artist_website: website
        });
        setIsLoading(false);
    }

    return (
        //create CollapsibleBody component
        <CollapsibleBody 
            expanded={props.openId === "contact"}
            id="contact"
            title="Contact Information"
            icon={<CloudOutlined />}
            handleClick={props.setOpenId}
            mainSx={{
                alignItems: "stretch",
                fontFamily: "'Bellefair', sans-serif;",
                fontWeight: "normal",
            }}
        >
            <Box container m={3}>
                 <div className='mb-3'>
                      <center >
                           <h3>Displayed on Proof of Registration, etc</h3>
                      </center>
                </div>
                {/* <br /> */}
                <Grid
                    container
                    spacing={1}
                    sx={{ 
                        flexGrow: 1,
                        justifyContent: "center",
                    }}
                    display="flex"
                    columns={2}
                    direction="row"
                >
                    <Grid
                        item
                        xs={1}
                        color="transparent"
                        sx={{
                            boxShadow: 0,
                            alignSelf: "flex-start"
                        }}
                    >
                        <ArtisInput
                            label="Website"
                            value={website}
                            InputLabelProps={{
                                required: false, 
                                sx:{color: "teal"}, 
                                shrink: true
                            }}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        sx={{
                            alignSelf: "flex-end"
                        }}
                    >
                        <ArtisInput
                            label="Phone"
                            value={phone}
                            InputLabelProps={{
                                required: false, 
                                sx:{color: "teal"}, 
                                shrink: true
                            }}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={1}
                    sx={{ 
                        flexGrow: 1,
                        justifyContent: "center",
                    }}
                    display="flex"
                    rows={5}
                    column={1}
                    direction="column"
                >
                    <Grid
                        item
                        xs={1}
                        color="transparent"
                        sx={{
                            boxShadow: 0,
                            alignSelf: "stretch"
                        }}
                    >
                        <ArtisInput
                            label="Street 1"
                            value={street1}
                            InputLabelProps={{
                                required: false,
                                sx: {color: "teal"},
                                shrink: true
                            }}
                            onChange={(e) => setStreet1(e.target.value)}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        color="transparent"
                        sx={{
                            boxShadow: 0,
                            alignSelf: "stretch"
                        }}
                    >
                        <ArtisInput
                            label="Street 2"
                            value={street2}
                            InputLabelProps={{
                                required: false,
                                sx: {color: "teal"},
                                shrink: true
                            }}
                            onChange={(e) => setStreet2(e.target.value)}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        color="transparent"
                        sx={{
                            boxShadow: 0,
                            alignSelf: "stretch"
                        }}
                    >
                        <ArtisInput
                            label="City"
                            value={city}
                            InputLabelProps={{
                                required: false,
                                sx: {color: "teal"},
                                shrink: true
                            }}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        color="transparent"
                        sx={{
                            boxShadow: 0,
                            alignSelf: "stretch"
                        }}
                    >
                        <ArtisInput
                            label="State/Region"
                            value={state}
                            InputLabelProps={{
                                required: false,
                                sx: {color: "teal"},
                                shrink: true
                            }}
                            onChange={(e) => setState(e.target.value)}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        color="transparent"
                        sx={{
                            boxShadow: 0,
                            alignSelf: "stretch"
                        }}
                    >
                        <ArtisInput
                            label="Zip / Region Code"
                            value={zip}
                            InputLabelProps={{
                                required: false,
                                sx: {color: "teal"},
                                shrink: true
                            }}
                            onChange={(e) => setZip(e.target.value)}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        sx={{
                            boxShadow: 0,
                            alignSelf: "stretch"
                        }}
                        mb={2}
                    >
                        <CountrySelect 
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            name="Country"
                        />
                    </Grid>
                </Grid>
                <Loader isLoading={isLoading} />
                <ArtisButton
                    id="update_contacts"
                    onClick={handleSubmit}
                    name="Update"
                    sx={{
                        fontSize: "1.5rem",
                        mb: 3,
                    }}
                /> 
            </Box>      
        </CollapsibleBody>
    );
}
