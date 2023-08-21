import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import LinearProgress from "@mui/material/LinearProgress";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import EmailIcon from "@mui/icons-material/Email";
import TextField from "@mui/material/TextField";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import PeopleIcon from "@mui/icons-material/People";
import { CircularProgress, Typography, Modal } from "@mui/material";
import VerifyIcon from "@mui/icons-material/NetworkLocked";

import WorkService from "../api/service";
import UserService from "../api/auth";
import CollapsibleBody from "../components/collapsible";
import ArtisFooter from "../components/footer";
import DetailLoadingBox from "../components/work/detail-box";
import DetailedNoFound from "../components/work/detail-nofound";
import useCheckMobileScreen from "../hooks/isMobile";

import ArtisInput from "../components/inputs/textfield";
import utils from "../utils";

import { FameUserItemWrapper } from "../components/tabs/FameUserItem";
import Government from "../components/work/edit/collapsibles/government";
import Bio from "../components/work/edit/collapsibles/artist-bio";
import GPSLocation from "../components/work/edit/collapsibles/gps-location";
import Fade from '@mui/material/Fade';

export default function WorkDetail(props) {
  const isMobile = useCheckMobileScreen(400);

  const [work, setWork] = useState(null);
  const [profile, setProfile] = useState(null);
  const [openId, setOpenId] = useState("");
  const [openVerifyId, setVerifyId] = useState("");
  const [connections, setConnections] = useState(null);
  const [allCollabs, setAllCollabs] = useState(null);
  const [isExist, setIsExist] = useState(null);
  const [allCollabsbyWork, setAllCollabsbyWork] = useState([]);
  const { artis_code } = useParams();
  const [allCommunity, setAllCommunity] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [image, setImage] = useState("false");

  const fetchWork = async (artis_code) => {
    try {
      const response = await WorkService.getWork(artis_code);
      const { work, user } = response?.result;
      return {
        work,
        user,
      };
    } catch (error) {}
  };

  const fetchFameData = async (query, id, method) => {
    try {
      const response = await UserService.getFameConnections(query);
      if (response.result) {
        const verified_connections = [];
        const unverified_connections = [];
        if (method === "detail") {
          var all_community_detail = [];
          response.result.all_fame.forEach((fame) => {
            const customerUser =
              id === fame?.sender[0].user_id
                ? fame?.invitee[0]
                : fame?.sender[0];

            if (customerUser.is_kyced) {
              verified_connections.push({ ...fame, user: customerUser });
            } else {
              unverified_connections.push({ ...fame, user: customerUser });
            }
          });
          const filteredVerifiedNoOrder = verified_connections.filter(
            (v) => v.order === 0
          );
          const orderedVerified = verified_connections
            .filter((c) => c.order !== 0)
            .sort((a, b) => a.order - b.order);
          const result = orderedVerified.concat(filteredVerifiedNoOrder);
          all_community_detail.push({
            verified_connections: result,
            unverified_connections,
          });
          setConnections({
            verified_connections: result,
            unverified_connections,
          });
          setAllCommunity(all_community_detail);
        } else {
          var ids = id.split(",");
          var all_community = [];
          ids.forEach((id) => {
            var verified_connections = [];
            var unverified_connections = [];
            response.result[id].all_fame.forEach((fame) => {
              const customerUser =
                parseInt(id) === fame?.sender[0].user_id
                  ? fame?.invitee[0]
                  : fame?.sender[0];

              if (customerUser.is_kyced) {
                verified_connections.push({ ...fame, user: customerUser });
              } else {
                unverified_connections.push({ ...fame, user: customerUser });
              }
            });
            const filteredVerifiedNoOrder = verified_connections.filter(
              (v) => v.order === 0
            );
            const orderedVerified = verified_connections
              .filter((c) => c.order !== 0)
              .sort((a, b) => a.order - b.order);
            const result = orderedVerified.concat(filteredVerifiedNoOrder);
            all_community.push({
              verified_connections: result,
              unverified_connections,
            });
          });
          setAllCommunity(all_community);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    WorkService.lookup(artis_code)
      .then((res) => {
        if (res.hasOwnProperty("result")) {
          fetchWork(artis_code)
            .then(({ work, user }) => {
              setWork(work);
              setProfile(user);
              setIsExist(work.registered_on_blockchain);
              document.title = "Artis.app | " + work?.title;
            })
            .catch((err) => {});
        } else {
          console.error("this is error");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [artis_code]);

  const _getProvenance = (tx_hash, sold_tx_hash) => {
    if (sold_tx_hash && sold_tx_hash !== "0") {
      return (
        <CollapsibleBody
          expanded={openId === "provenance-body"}
          id="provenance-body"
          title="Provenance"
          icon={<PeopleIcon />}
          handleClick={setOpenId}
          mainSx={{
            alignItems: "flex-start",
            fontFamily: "'Montserrat', sans-serif;",
            fontWeight: "normal",
          }}
        >
          <Box component="p" ml={3} mr={3}>
            <br />
            <a
              style={{ textDecoration: "none" }}
              href={`https://polygonscan.com/tx/${sold_tx_hash}`}
              target="_blank"
              rel="noreferrer"
            >
              {work?.sold_date.slice(0, 10)} {profile?.first_name}{" "}
              {profile?.last_name} sold to {work?.sold_buyer}
            </a>
            <br />
            <br />
          </Box>
        </CollapsibleBody>
      );
    }
  };

  const fetchCollabs = async () => {
    const response = await WorkService.getCollaboratorStatus();
    const sendbody = {
      work_id: work.id,
      artis_code: work.artis_code,
      emails: work.emails,
    };
    const response_allcollabyId = await WorkService.getCollaboratorById(
      sendbody
    );
    if (response_allcollabyId.result) {
      var allCollabsbyWork = response_allcollabyId.result;

      // setIsExist(true);
      if (allCollabsbyWork.length === 1) {
        const myprofile = allCollabsbyWork[0].profile;
        const query = `?q=detail&id=${myprofile.user_id}`;
        fetchFameData(query, myprofile.user_id, "detail");
        // setIsExist(true);
      } else {
        // var exist = true;
        var ids = allCollabsbyWork[0].profile.user_id;
        // if (
        //   !allCollabsbyWork[0].collaborator.hasOwnProperty("work_creator") &&
        //   allCollabsbyWork[0].collaborator?.sign_status !== 1
        // ) {
          // exist = false;
        // }
        for (var i = 1; i < allCollabsbyWork.length; i++) {
          var collaborator = allCollabsbyWork[i];
          ids += "," + collaborator.profile.user_id;
          // if (
          //   !collaborator.collaborator.hasOwnProperty("work_creator") &&
          //   collaborator.collaborator?.sign_status !== 1
          // )
            // exist = false;
        }
        const query = `?q=multiple&id=${ids}`;
        // setIsExist(exist);
        fetchFameData(query, ids, "multiple");
      }
      setAllCollabsbyWork(allCollabsbyWork);
    }
    if (response.result) {
      const getWork = response.result.filter((res) => res.work.id === work.id);

      const getUserWork = getWork.filter(
        (w) =>
          w.registered_by_id === profile.user.id &&
          !w.work.rejected_collab &&
          w.signed
      );

      setAllCollabs(getUserWork);
    }
  };
  
  useEffect(() => {
    if (work && profile) {
      fetchCollabs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work, profile]);

  if (!work || !profile) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  const handleVerify = async (body) => {
    try {
      const response = await WorkService.verifyFile(work.artis_code, body);
      if (response?.result) {
        return response.result.match;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  
  const handleOpenImage = (value) => {
    setImage(value);
    setOpenImage(true);
  };

  return (
    <div>
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Container maxWidth="sm">
          {isExist === false && (
            <Slide direction="left" in={true} mountOnEnter unmountOnExit>
              <Container maxWidth="sm">
                <DetailedNoFound isMobile={isMobile} />
                <br />
                <br />
                <br />
                <br />
                <br />
                <ArtisFooter />
              </Container>
            </Slide>
          )}
          {isExist && <DetailLoadingBox isMobile={isMobile} />}
          {isExist && (
            <Box mb={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
                overflow: "hidden",
                boxShadow: 1,
                fontWeight: "bold",
              }}
            >
              <Typography>
                <center>
                  {work?.work_type === "Photograph" && work?.work_image.image && (
                    <div
                    style={{
                      // backgroundImage: `url(${work?.work_image?.image})`,
                      // width: "100%",
                      // height: window.innerHeight * 0.7,
                      // backgroundSize: "cover",
                      // backgroundPosition: "center",
                      // backgroundRepeat: "no-repeat",
                      // backgroundImage: `url(/images/bluebrushstroke.jpg)`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => handleOpenImage(work?.work_image?.image)}
                  >
                    <Box
                      component="img"
                      alt={work?.description}
                      sx={{
                        width: "auto",
                        maxHeight: "70vh",
                        cursor: "pointer",
                      }}
                      src={work.work_image.image}
                    />
                  </div>
                    )}
                </center>
              </Typography>
              <Box
                component="p"
                sx={{
                  fontFamily: "Bellefair, serif",
                  fontSize: "1.5rem",
                  fontStyle: "italic",
                  fontWeight: "normal",
                }}
              >
                <center>{work?.description}</center>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  m: 3,
                  minWidth: { md: 350 },
                }}
              >
                {work?.sold_tx_hash && work?.sold_tx_hash === "0" && (
                  <>
                    {work.sale_description && (
                      <Box
                        component="div"
                        style={{
                          paddingTop: 20,
                          paddingBottom: 12,
                          borderRadius: 10,
                          minHeight: 50,
                          backgroundColor: "#e0e0e0",
                          width: "60%",
                          display: "flex",
                          flexFlow: "column wrap",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        sx={{
                          fontSize: "1.3rem",
                          mt: 1,
                          fontFamily: "Bellefair, serif",
                          fontWeight: 400,
                          backgroundColor: "grey",
                        }}
                      >
                        <Box
                          component="span"
                          color="green"
                          sx={{
                            fontSize: "2.7rem",
                            mt: 1,
                            fontFamily: "Bellefair, serif",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            component="span"
                            color="gray"
                            sx={{
                              fontSize: "2.7rem",
                              alignItems: "center",
                            }}
                          >
                            FOR SALE
                            <br />
                            <br />
                          </Box>
                          <div>
                            <center>{work.sold_price}</center>
                          </div>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "1.5rem",
                          }}
                        >
                          {work.sale_description}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}

                <Box
                  component="h1"
                  sx={{
                    fontSize: "2.3rem",
                    mt: 1,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  <center>{work?.title}</center>
                </Box>
                <Box
                  sx={{
                    fontSize: isMobile ? "1.2rem" : "1.5rem",
                    fontWeight: "normal",
                    fontFamily: "Bellefair, serif",
                    display: "flex",
                    flexFlow: "column wrap",
                    alignItems: "center",
                  }}
                >
                  <center>
                    <span nowrap>
                      © {work?.copyright_date?.slice(0, 4)}{" "}
                      {`${work?.copyright_owner}`}
                      {profile.user.is_kyced && (
                        <img
                          style={{ height: 10, marginLeft: 1 }}
                          alt="identity validated"
                          src="/images/GoldWreath.jpg"
                        />
                      )}
                      {allCollabs?.map((col, index) => {
                        if (col?.oncopyright === true) {
                          return (
                            <>
                              {","}
                              {" " + col.collaborator.first_name}{" "}
                              {col.collaborator.last_name}
                              {col.collaborator.is_kyced && (
                                <img
                                  style={{ height: 10, marginLeft: 1 }}
                                  alt="identity validated"
                                  src="/images/GoldWreath.jpg"
                                />
                              )}
                            </>
                          );
                        }
                        return <></>;
                      })}
                    </span>
                  </center>
                </Box>
                {connections?.ordered_verified_connections?.map((con) => {
                  return (
                    <>
                      <Box
                        sx={{
                          fontSize: "0.5rem",
                          fontWeight: "normal",
                          fontFamily: "Bellefair, serif",
                          display: "flex",
                          color: "grey",
                          flexFlow: "row wrap",
                          alignItems: "center",
                        }}
                      >
                        Validated by
                      </Box>
                      <Box
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "normal",
                          fontFamily: "Bellefair, serif",
                          color: "grey",
                          display: "flex",
                          flexFlow: "row wrap",
                          alignItems: "center",
                        }}
                      >
                        {con.invitee_name}
                      </Box>
                    </>
                  );
                })}
                {work?.sold_tx_hash && work.sold_tx_hash !== "0" && (
                  <>
                    <Box component="span" color="gray" mb={3} mt={3}>
                      {/* <br /> */}
                      Acquired by:
                      {/* <br />
                      <br /> */}
                    </Box>
                    <Box
                      sx={{
                        fontFamily: "Bellefair, serif",
                        fontWeight: "normal",
                        fontSize: "2rem",
                      }}
                    >
                      {work?.sold_buyer}
                    </Box>
                  </>
                )}
                {work?.artist_statement && (
                  <>
                    <Box
                      component="span"
                      color="gray"
                      fontFamily="Montserrat, sans-serif"
                    >
                      <br />
                      {work?.artist_type || "Artist "} Statement:
                    </Box>
                    <Box
                      component="p"
                      color="black"
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "1.2em",
                        fontWeight: "normal",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {work?.artist_statement}
                    </Box>
                  </>
                )}
              </Box>
              {/* <br /> */}
              {allCollabsbyWork.length > 0 && (
                <Box
                  component="p"
                  display="inline"
                  color="gray"
                  sx={{ marginLeft: "22px" }}
                >
                  {allCollabsbyWork.length === 1 ? "Registered by" : "Collaborators"}
                </Box>
              )}
              {allCollabsbyWork.length > 0 &&
                allCollabsbyWork &&
                allCollabsbyWork.map((data, index) => (
                  <Bio
                    openId={openId}
                    setOpenId={setOpenId}
                    collaborator_id={data?.profile?.id}
                    contribution={data?.collaborator?.contribution}
                    detail={true}
                    ownership={data?.collaborator?.ownership}
                    oncopyright={data?.collaborator?.oncopyright}
                    bio={data?.profile?.artist_bio}
                    isEdit={false}
                    is_kyced={data?.collaborator?.is_kyced}
                    website={data?.profile?.artist_website}
                    photo={
                      data?.profile?.photo
                        ? `https://artis-stage-data.s3.amazonaws.com/static/${data?.profile?.photo}`
                        : ""
                    }
                    first_name={data?.profile?.first_name.toUpperCase()}
                    last_name={data?.profile?.last_name.toUpperCase()}
                    token={""}
                    signed={
                      data.collaborator.hasOwnProperty("signed")
                        ? data.collaborator.signed
                        : true
                    }
                    handleBioUpdate={() => console.log("bio")}
                    artist_type={data?.collaborator?.contribution}
                    subCollabs={allCollabs}
                    onEditPage={false}
                    hiddenTitle
                    allCommunity={
                      <Box sx={{ marginLeft: 2.5, marginRight: 2.5 }}>
                        <Box
                          component="p"
                          display="inline"
                          color="gray"
                          sx={{ marginLeft: "0px" }}
                        >
                          creative community
                        </Box>
                        {allCommunity[index]?.verified_connections.length ===
                          0 &&
                          allCommunity[index].unverified_connections.length ===
                            0 && (
                            <Typography>
                              No community connections yet
                            </Typography>
                        )}
                        {allCommunity[index]?.verified_connections?.length >
                          0 && (
                          <>
                            {allCommunity[index]?.verified_connections?.map(
                              (fame) => {
                                const customerUser = fame.user;
                                const name =
                                  customerUser?.first_name &&
                                  customerUser?.last_name
                                    ? `${customerUser?.first_name} ${customerUser?.last_name}`
                                    : fame.invitee_name;
                                return (
                                  <FameUserItemWrapper
                                    user={{ ...customerUser }}
                                    showOrder={false}
                                    name={name}
                                    is_kyced={customerUser.is_kyced}
                                    order={fame.order}
                                    shouldExpand={true}
                                    userProfile={profile}
                                  />
                                );
                              }
                            )}
                          </>
                        )}
                        {allCommunity[index]?.unverified_connections?.length >
                          0 && (
                          <>
                            {allCommunity[index]?.unverified_connections?.map(
                              (fame) => {
                                const customerUser = fame.user;
                                const name =
                                  customerUser?.first_name &&
                                  customerUser?.last_name
                                    ? `${customerUser?.first_name} ${customerUser?.last_name}`
                                    : fame.invitee_name;
                                return (
                                  <FameUserItemWrapper
                                    name={name}
                                    is_kyced={customerUser.is_kyced}
                                    order={fame.order}
                                    shouldExpand={true}
                                    user={{ ...customerUser }}
                                    userProfile={profile}
                                  />
                                );
                              }
                            )}
                          </>
                        )}
                        <Typography
                          fontSize="0.9rem"
                          component="h2"
                          gutterBottom
                          width="100%"
                          float="right"
                          textAlign="right"
                        >
                          Tap name to display more information
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              <br />
              {/* {allCollabsbyWork.length < 2 &&
                !work.hide_artist_info &&
                (profile?.photo ||
                  profile?.artist_bio ||
                  profile?.artist_website) && (
                  <CollapsibleBody
                    expanded={openId === "info-body"}
                    id="info-body"
                    title={`${work?.artist_type} Information`}
                    icon={<PersonIcon fontSize="medium" />}
                    handleClick={setOpenId}
                    collapseProps={{
                      sx: {
                        textAlign: "center",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      mt={1}
                      src={profile?.photo}
                      style={{
                        maxWidth: "60%",
                        maxHeight: "60%",
                      }}
                    ></Box>
                    <Box
                      component="p"
                      sx={{
                        mt: 0,
                        textAlign: "center",
                      }}
                    >
                      <a
                        style={{ textDecoration: "none" }}
                        href={`https://${profile?.artist_website}`}
                      >
                        {profile?.artist_website}
                      </a>
                    </Box>

                    <Box
                      component="p"
                      sx={{
                        whiteSpace: "pre-wrap",
                        fontSize: "1rem",
                        fontFamily: "'Montserrat', sans-serif;",
                        fontWeight: "normal",
                        m: 3,
                        textAlign: "left",
                      }}
                    >
                      {profile?.artist_bio}
                    </Box>
                    <br />
                    <Box
                      component="p"
                      sx={{
                        whiteSpace: "pre-wrap",
                        fontSize: "1rem",
                        fontFamily: "'Montserrat', sans-serif;",
                        fontWeight: "normal",
                        m: 3,
                        textAlign: "left",
                      }}
                    >
                      <h6 textAlign="left">
                        <strong>Creative Community</strong>
                      </h6>
                    </Box>
                    <Box sx={{ marginLeft: 2.5, marginRight: 2.5 }}>
                      {connections?.verified_connections.length === 0 &&
                        connections.unverified_connections.length === 0 && (
                          <Typography>No community connections yet</Typography>
                        )}
                      {connections?.verified_connections?.length > 0 && (
                        <>
                          {connections?.verified_connections?.map((fame) => {
                            const customerUser = fame.user;
                            const name =
                              customerUser?.first_name &&
                              customerUser?.last_name
                                ? `${customerUser?.first_name} ${customerUser?.last_name}`
                                : fame.invitee_name;
                            return (
                              <FameUserItemWrapper
                                user={{ ...customerUser }}
                                showOrder={false}
                                name={name}
                                is_kyced={customerUser.is_kyced}
                                order={fame.order}
                                shouldExpand={true}
                                userProfile={profile}
                              />
                            );
                          })}
                        </>
                      )}
                      {connections?.unverified_connections?.length > 0 && (
                        <>
                          {connections?.unverified_connections?.map((fame) => {
                            const customerUser = fame.user;
                            const name =
                              customerUser?.first_name &&
                              customerUser?.last_name
                                ? `${customerUser?.first_name} ${customerUser?.last_name}`
                                : fame.invitee_name;
                            return (
                              <FameUserItemWrapper
                                name={name}
                                is_kyced={customerUser.is_kyced}
                                order={fame.order}
                                shouldExpand={true}
                                user={{ ...customerUser }}
                                userProfile={profile}
                              />
                            );
                          })}
                        </>
                      )}
                      <Typography
                        fontSize="0.9rem"
                        component="h2"
                        gutterBottom
                        width="100%"
                        float="right"
                        textAlign="right"
                      >
                        Tap name to display more information
                      </Typography>
                    </Box>

                    {allCollabs && (
                      <>
                        <Box
                          component="p"
                          sx={{
                            whiteSpace: "pre-wrap",
                            fontSize: "1rem",
                            fontFamily: "'Montserrat', sans-serif;",
                            fontWeight: "normal",
                            m: 3,
                            textAlign: "left",
                          }}
                        >
                          <h6 textAlign="left">
                            <strong>Collaborators</strong>
                          </h6>
                        </Box>
                        {allCollabs.map((col) => {
                          return (
                            <CollaboratorBody col={col} showSigned={false} />
                          );
                        })}
                      </>
                    )}
                  </CollapsibleBody>
                )} */}

              {_getProvenance(work?.tx_hash, work?.sold_tx_hash)}

              <CollapsibleBody
                expanded={openId === "cont-body"}
                id="cont-body"
                title="Contact Information"
                icon={<EmailIcon />}
                handleClick={setOpenId}
                mainSx={{
                  alignItems: "flex-start",
                  fontFamily: "'Montserrat', sans-serif;",
                  fontWeight: "normal",
                }}
              >
                {/* <br /> */}
                <Box
                  component="p"
                  sx={{
                    whiteSpace: "pre-wrap",
                    fontSize: "0.9rem",
                    m: 3,
                    textAlign: "left",
                  }}
                >
                  <strong>
                    {profile?.first_name} {profile?.last_name}
                  </strong>
                  {profile?.organization && (
                    <>
                      {/* 
                    <br />
                    {profile?.organization}
                    */}
                    </>
                  )}
                  {(profile?.street_1 ||
                    profile?.state ||
                    profile?.city ||
                    profile?.zip_code) && (
                    <>
                      <br />
                      {profile?.street_1} {profile?.street_2}
                      <br />
                      {profile?.city} {profile?.state} {profile?.zip_code}
                    </>
                  )}

                  {profile?.country && <> {profile?.country}</>}

                  {profile?.phone_number && (
                    <>
                      <br />
                      ph: {profile?.phone_number}
                    </>
                  )}
                  {profile?.artist_website && (
                    <>
                      <br />
                      <a href={`https://${profile?.artist_website}`}>
                        {`${profile?.artist_website}`}
                      </a>
                    </>
                  )}
                </Box>
                <br />
              </CollapsibleBody>
              <CollapsibleBody
                expanded={openId === "auth-body"}
                id="auth-body"
                title="On Blockchain Verification"
                icon={<FingerprintIcon />}
                handleClick={setOpenId}
                mainSx={{
                  alignItems: "flex-start",
                  fontFamily: "'Montserrat', sans-serif;",
                  fontWeight: "normal",
                }}
              >
                {/* <br />
                <br /> */}

                <Box mb={4} mt={4}
                  component="p"
                  ml={3}
                  sx={{
                    color: "gray",
                  }}
                >
                  This work's digital fingerprint, copyright/creation date, and
                  creator's name were recorded on the blockchain on:{" "}
                  <strong >{work?.registered_date.slice(0, 10)} </strong>
                  {/* <br />
                  <br /> */}
                </Box>

                <Box 
                  component="span"
                  sx={{
                    color: "gray",
                    fontSize: "0.9rem",
                    m: 3,
                  }}
                >
                  Work's Digital Fingerprint:
                  <TextField
                    variant="outlined"
                    defaultValue={work?.work_copy_fingerprint}
                    sx={{
                      m: 3,
                      width: "90%",
                    }}
                  />
                  <Box component="p" ml={3} mr={3}>
                    Can be found on the blockchain
                    <a
                      style={{ textDecoration: "none" }}
                      href={`https://polygonscan.com/tx/${work?.tx_hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {" "}
                      here.
                    </a>
                    {/* <br /> */}
                  </Box>
                  <Box mt={3}>
                    <VerifyWork
                      openId={openVerifyId}
                      setOpenId={setVerifyId}
                      fileSize={work?.work_copy_size}
                      fileName={work?.work_copy_name}
                      registeredDate={work?.registered_date}
                      id={work?.id}
                      handleVerify={handleVerify}
                    />
                  </Box>
                </Box>
              </CollapsibleBody>

              <GPSLocation
                openId={openId}
                setOpenId={setOpenId}
                location={work?.location}
              />

              <Government
                openId={openId}
                setOpenId={setOpenId}
                artis_code={artis_code}
                onCopyRight={"collaborator_false"}
                hidden={true}
                onEdit={false}
              />
              <CollapsibleBody
                expanded={openId === "manage-body"}
                id="manage-body"
                title="Manage"
                icon={<PublishedWithChangesIcon />}
                handleClick={setOpenId}
                mainSx={{
                  alignItems: "flex-start",
                  fontFamily: "'Montserrat', sans-serif;",
                  fontWeight: "normal",
                }}
              >
                <Box component="p" ml={3} mr={3}>
                  If you are the copyright owner, seller or owner of this work,
                  please
                  <a href="/login" style={{ textDecoration: "none" }}>
                    {" "}
                    login{" "}
                  </a>{" "}
                  to manage this work.
                </Box>
              </CollapsibleBody>
              {/* <br /> */}
              <Typography
                mt={3}
                fontSize="0.9rem"
                component="h2"
                gutterBottom
                width="100%"
                float="right"
                textAlign="right"
              >
                <img
                  style={{ height: 10 }}
                  alt="identity validated"
                  src="/images/GoldWreath.jpg"
                />{" "}
                = identity confirmed with government documents
              </Typography>
            </Box>
          )}
          {/* <br />
          <br />
          <br />
          <br />
          <br /> */}
          <ArtisFooter />
        </Container>
      </Slide>
      <Modal
        open={openImage}
        onClose={() => setOpenImage(false)}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={openImage} timeout={500} sx={{ outline: "none" }}>
          <img
            src={image}
            alt="asd"
            style={{ maxHeight: "90%", maxWidth: "90%" }}
          />
        </Fade>
      </Modal>
    </div>
  );
}

const VerifyWork = (props) => {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState("");
  const [isMatch, setIsMatch] = useState(false);

  const handleVerify = async (event) => {
    if (event.target.files && event.target.files.length) {
      const formData = new FormData();
      formData.append("work", event.target.files[0]);
      setLoading(true);
      try {
        const match = await props.handleVerify(formData);
        setIsMatch(match);
        setLoading(false);
        setFile(event.target.files[0]?.name);
      } catch (e) {
        setIsMatch(false);
      }
    }
  };

  return (
    <CollapsibleBody
      expanded={props.openId === "verify-body"}
      id="verify-body"
      title={"Verify Fingerprint"}
      icon={<VerifyIcon />}
      handleClick={props.setOpenId}
      mainSx={{
        alignItems: "center",
      }}
    >
      <Box component="p" ml={3} mr={3}> mt={3}
      {/* <br /> */}
        If the digital fingerprint of the file being selected below matches the
        fingerprint recorded on the blockchain, then the two files will be
        verified as being identical. 
        <br />
        <br />
        Artis.app uses SHA-256 to calculate digital finger prints. There are
        more atoms in the universe than the statistcal chance that two different
        files have the same SHA-256 digial fingerprint.
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
            <Box component="h4">{isMatch ? "VERIFIED" : "NOT VERIFIED"}</Box>
            <Box component="h6">
              {isMatch
                ? "Digital fingerprint MATCHES the orignal's registered on the blockchain on " +
                  utils.formatDate(props?.registeredDate)
                : "Digital fingerprint does NOT match the original's registered on the blockchain on " +
                  utils.formatDate(props?.registeredDate)}
            </Box>
          </Box>
        )}
      </Box>

      <Box component="form" ml={3} mr={3}>
        <ArtisInput
          label="Select file to verify"
          value={file}
          onClick={() => document.getElementById("verify-file").click()}
        />
        {loading && (
          <Box
            textAlign="center"
            sx={{
              mb: "2%",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <input
          id="verify-file"
          type="file"
          onChange={(event) => handleVerify(event)}
          style={{ display: "none" }}
        />
      </Box>
    </CollapsibleBody>
  );
};
