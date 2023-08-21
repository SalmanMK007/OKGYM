import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Slide from "@mui/material/Slide";
import { useHistory } from "react-router";
import Box from "@mui/material/Box";
import Username from "../components/user/username";
import { useUser } from "../hooks/user";
import UserService from "../api/auth";
import Bio from "../components/work/edit/collapsibles/artist-bio";
import DisplayAs from "../components/user/display";
import DefaultTags from "../components/user/tags";
import ContactInfo from "../components/user/contact";
import ResetEmail from "../components/user/reset-email";
import ArtisFooter from "../components/footer";
import VerifyUser from "../components/user/verify";

export default function Settings(props) {
  const history = useHistory();
  const { user, setUser } = useUser();
  const [openId, setOpenId] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [profile, setProfile] = useState(user?.profile);
  useEffect(() => {
    document.title = "Settings | Artis.app";
  
    getVerificationStatus();
    // strip ? from query string
    const query = history.location.search.slice(1) || "";
    setOpenId(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getArtistType = () => {
    if (profile?.artist_type) return profile?.artist_type;
    return "Artist";
  };

  const getVerificationStatus = async () => {
    try {
      const response = await UserService.getVerificationStatus()
      const { is_kyced, verification_submitted, verification_date} = response.result
      setUser({
        ...user,
        profile: {
          ...user.profile, user: {
            ...user.profile.user,
            verification_submitted,
            is_kyced,
            verification_date,
          }
        },
      });
    } catch (error) {
      
    }
  }

  const handleArtistTypeUpdate = async (referAs) => {
    const response = await UserService.updateArtistType({
      artist_type: referAs,
    });
    if (response?.result) {
      const { artist_type } = response.result;
      setUser({
        ...user,
        profile: { ...user.profile, artist_type },
      });
    }
  };

  const handleVeificationUpdate = async (formData) => {
    try {
      await UserService.updateVerification(formData);
      setUser({
        ...user,
        profile: {
          ...user.profile, user: {
            ...user.profile.user,
            verification_submitted: true,
          }
        },
      });
    } catch (error) {
      console.error(error)
    }

  };

  const handleBioUpdate = async (body) => {
    const response = await UserService.updateProfile(body);
    if (response?.result) {
      const { artist_bio, artist_website, photo } = response.result;
      setUser({
        ...user,
        profile: { ...user.profile, artist_bio, artist_website, photo },
      });
    }
  };

  const handleKycedUpdate = async ({is_kyced, verification_submitted}) => {
    try {
      await UserService.updateKyced({
        is_kyced,
        verification_submitted
      });
      setUser({
        ...user,
        profile: {
          ...user.profile, user: {
            ...user.profile.user,
            is_kyced,
            verification_submitted,
          }
        },
      });
    } catch (error) {
      console.error(error)
    }
  };

  const handleContactInfoUpdate = async (body) => {
    const response = await UserService.updateProfile(body);
    if (response?.result) {
      const {
        phone_number,
        street_1,
        street_2,
        artist_website,
        country,
        city,
        state,
        zip_code,
      } = response.result;
      setUser({
        ...user,
        profile: {
          ...user.profile,
          phone_number,
          street_1,
          street_2,
          artist_website,
          country,
          city,
          state,
          zip_code,
        },
      });
    }
  };

  const handleUpdateTags = async (tags, default_tags) => {
    const response = await UserService.updateTags({
      tags,
      default_tags,
    });
    if (response?.result) {
      const { tags, default_tags } = response.result;
      setUser({
        ...user,
        profile: { ...user.profile, tags, default_tags },
      });
    }
  };

  return (
    <div>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <Container maxWidth="md">
          <Box style={{ textAlign: "center" }} m={3} fontSize="1.7rem">
            <img
              src="https://artis.app/images/settings_sketch.jpg"
              alt="Settings Icon"
            />{" "}
            Settings:
          </Box>
          <Grid
            direction="column"
            alignItems="stretch"
            container
            sx={{
              mb: 10,
            }}
          >
            <Username
              openId={openId}
              setOpenId={setOpenId}
              username={user?.username}
              organization={user?.profile?.organization || ""}
              name={`${user?.profile.first_name} ${user?.profile.last_name}`}
            />
            <VerifyUser
              openId={openId}
              verification={{
                isKyced: user?.profile?.user?.is_kyced,
                verificationSubmitted: user?.profile?.user?.verification_submitted,
                verificationDate: user?.profile?.user?.verification_date,
                handleKycedUpdate,
              }}
              setOpenId={setOpenId}
              handleVeificationUpdate={handleVeificationUpdate}
              username={`${user?.profile.first_name} ${user?.profile.last_name}`}
            />
            <ResetEmail
              openId={openId}
              setOpenId={setOpenId}
              email={user?.profile.email}
              firstName={user?.profile.first_name}
              lastName={user?.profile.last_name}
            />
            <ContactInfo
              openId={openId}
              setOpenId={setOpenId}
              phone={profile?.phone_number}
              website={profile?.artist_website}
              country={profile?.country}
              city={profile?.city}
              state={profile?.state}
              zip={profile?.zip_code}
              street1={profile?.street_1}
              street2={profile?.street_2}
              handleContactInfoUpdate={handleContactInfoUpdate}
            />
            <Bio
              isSettings={true}
              openId={openId}
              setOpenId={setOpenId}
              bio={profile?.artist_bio}
              website={profile?.artist_website}
              photo={profile?.photo}
              token={user?.access}
              handleBioUpdate={handleBioUpdate}
              artist_type={getArtistType()}
              onEditPage={false}
            />
             <DefaultTags
              openId={openId}
              setOpenId={setOpenId}
              tags={profile?.tags}
              defaultTags={profile?.default_tags}
              handleUpdateTags={handleUpdateTags}
            />
            <DisplayAs
              openId={openId}
              setOpenId={setOpenId}
              referAs={profile?.artist_type}
              updateReferAs={handleArtistTypeUpdate}
            />
            
          </Grid>
          <ArtisFooter />
        </Container>
      </Slide>
    </div>
  );
}
