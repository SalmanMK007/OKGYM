import CloudOutlined from "@mui/icons-material/CloudOutlined";
import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';

import { format } from 'date-fns'

import CollapsibleBody from "../collapsible";
import ArtisButton from "../buttons/button";
import Loader from "../buttons/loader";
import ArtisInput from "../inputs/textfield";

export default function VerifyUser(props) {
    const uploadGovRef = useRef();
    const uploadSelfieRef = useRef();
    const [govId, setGovId] = useState(null)
    const [selfieId, setSelfieId] = useState(null)
    const [sizeError, setSizeError] = useState(null)
    const { verification: { isKyced, verificationSubmitted, verificationDate} } = props
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('verify_gov_id', govId)
        formData.append('verify_selfie', selfieId)
        setIsLoading(true);
        await props.handleVeificationUpdate(formData);
        setIsLoading(false);
    };

    const handleFileUpload = (event, name) => {
        if (event?.target && event.target?.files.length) {
            const type = event.target.files[0].type.split("/")[0]
            if (type !== 'image') {
                setSizeError("Please upload a valid image file")
                return
            }
            if (event.target.files[0].size > 10e6) {
                setSizeError("Please upload a file smaller than 10 MB")
            } else {
                const file = event.target.files[0]
                if (name === "selfie") {
                    setSelfieId(file)
                } else {
                    setGovId(file);
                }
                setSizeError(null)
            }
        }
    }

    return (
        <CollapsibleBody
            expanded={props.openId === "get_verified"}
            id="get_verified"
            title="Verify Your Identity"
            icon={<CloudOutlined />}
            handleClick={props.setOpenId}
            mainSx={{
                //alignItems: "stretch",
                //fontFamily: "'Bellefair', sans-serif;",
                fontWeight: "normal",
            }}
        >

            <Loader isLoading={isLoading} />
           
           
          
            <Box sx={{ padding: 3 }}>
                {isKyced && !verificationSubmitted &&
                    <Typography>The Artis.app team legally verified your identity on {format(new Date(verificationDate), 'dd.MM.yyyy')}</Typography>
                }
                {!isKyced && verificationSubmitted &&
                    <>
                        <Typography>Your verification documents have been submitted. Please be patient as it may take us a day or
                            two to check them.
                        </Typography>
                        {/* <br /> */}
                        <Typography className="mt-2">You'll receive a notification email when we have examined them.
                        </Typography>
                        {/* <br /> */}
                        <Typography sx={{ textAlign: "center" }}>Your Friendly Verification Team</Typography>
                    </>
                }
                {!isKyced && !verificationSubmitted &&
                    <>
                        <div className="mb-2">
                            <center>
                                <h3>Importance of legally verifying your identity cannot be understated. </h3>
                                <Typography>Through legal verification you:</Typography>
                            </center>
                        </div>
                        {/* <br /> */}
                        <Typography> &#x2022; Assure people and buyers you are who you claim, not a fake.  </Typography>
                        <Typography> &#x2022; Significantly elevate the value of and protection of your works.</Typography>
                        <Typography> &#x2022; Prevent others from creating accounts with your name.</Typography>
                        <Typography> &#x2022; Your legitimacy elevates the value, legitimacy and protection of works and artists you connect with.</Typography>
                        <Typography> &#x2022; Likewise, their verification elevates you and your works' value, legitimacy and protection.</Typography>
                        {/* <br /> */}
                        <div className="mt-5 mb-5">
                            <center>
                                <h5>Your verified status appears as a gold wreath beside your name:</h5>
                                {/* <br /> */}
                                <h3> ©2022 {props.username}<img style={{ height: 23, marginLeft: 10 }} alt="identity validated" src="/images/GoldWreath.jpg" /></h3>
                            </center>
                        </div>
                        {/* <br />
                        <br /> */}
                        <Typography className="mb-3">To get verified, you need two photos. </Typography>
                        {/* <br /> */}

                        <div >
                            <center>
                                <img
                                    src="https://artis.app/images/Artis_one.jpg"
                                    alt="ONE"
                                    width="40"
                                    height="40"
                                />
                            </center>
                        </div>

                        <Typography className="mb-3">CLOSE UP of the front of a GOVERNMENT ISSUED ID card with your photo
                            and name clearly readable by us. Best ID cards
                            are passports or driver’s liscenses. </Typography>
                        {/* <br /> */}
                        <ArtisInput
                            type="text"
                            label="Upload Govenrment ID:"
                            id="gov_id"
                            value={govId ? govId.name : ""}
                            name="govID"
                            onClick={() => uploadGovRef.current.click()}
                        />
                        {govId && (
                            <Box
                                textAlign="center"
                                sx={{
                                    mb: "2%",
                                    mt: 3,
                                }}
                            >
                                <img
                                    src={URL.createObjectURL(govId)}
                                    style={{ maxHeight: "200px", maxWidth: "200px" }}
                                    alt="ProfileImage"
                                />
                            </Box>
                        )}
                        <input 
                            id="upload_photo"
                            type="file"
                            ref={uploadGovRef}
                            onChange={(e) => handleFileUpload(e, "govId")}
                            accept="image/*"
                            hidden
                        />
                        {/* <br />
                        <br /> */}
                        <div className="mt-4">
                            <center>
                                <img
                                    src="https://artis.app/images/Artis_two.jpg"
                                    alt="TWO"
                                    width="40"
                                    height="40"
                                />
                            </center>
                        </div>
                        <Typography className="mb-2">SELFIE CLOSE-UP of you looking at the camera while holding the ID. Your entire face and ID must be clearly visible.</Typography>
                        {/* <br /> */}

                        <ArtisInput
                            type="text"
                            label="Upload Selfie:"
                            id="selfie_id"
                            value={selfieId ? selfieId.name : ""}
                            name="selfie"
                            onClick={() => uploadSelfieRef.current.click()}
                        />
                        {sizeError && (
                            <Typography>{sizeError}</Typography>
                        )}
                        <input
                            id="upload_photo"
                            type="file"
                            ref={uploadSelfieRef}
                            onChange={(e) => handleFileUpload(e, "selfie")}
                            accept="image/*"
                            hidden
                        />
                        {selfieId && (
                            <Box
                                textAlign="center"
                                sx={{
                                    mb: "2%",
                                    mt: 3,
                                }}
                            >
                                <img
                                    src={URL.createObjectURL(selfieId)}
                                    style={{ maxHeight: "200px", maxWidth: "200px" }}
                                    alt="ProfileImage"
                                />
                            </Box>
                        )}
                        {/* <br />
                        <br /> */}
                        <div className="mt-4">
                            <center>
                                <img
                                    src="https://artis.app/images/Artis_three.jpg"
                                    alt="THREE"
                                    width="40"
                                    height="40"
                                />
                            </center>
                        </div>
                        <ArtisButton
                            name="Verify Me"
                            type="submit"
                            textColor={!(govId && selfieId) ? 'grey' : 'teal'}
                            onClick={handleSubmit}
                            disabled={!(govId && selfieId)}
                            sx={{
                                fontSize: "1.5rem",
                                mb: 3,
                            }}
                        />
                        <Typography sx={{ color: "green", textAlign: "center" }}>After the Artis Verification Team reviews your submitted
                            ID photos, <br />they are are deleted from Artis.app in order to protect your confidentiality</Typography>
                    </>
                }
            </Box>
        </CollapsibleBody>
    );
}
