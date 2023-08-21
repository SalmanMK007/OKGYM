/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  LinearProgress,
  Slide,
  IconButton,
  Tooltip,
  Typography,
  Modal,
  Button,
} from "@mui/material";
import { useParams, useHistory } from "react-router-dom";
import QRCode from "qrcode.react";
import { Link } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import { WorkService, AuthService as UserService } from "../api";
import Bio from "../components/work/edit/collapsibles/artist-bio";
import Statement from "../components/work/edit/collapsibles/statement";
import utils from "../utils";
import Sell from "../components/work/edit/collapsibles/sell";
import Tags from "../components/work/edit/collapsibles/tags";
import Blockchain from "../components/work/edit/collapsibles/blockchain";
import Email from "../components/work/edit/collapsibles/email";
import VerifyWork from "../components/work/edit/collapsibles/verify";
import { FameUserItemWrapper } from "../components/tabs/FameUserItem";
import { useUser } from "../hooks/user";
import ArtisFooter from "../components/footer";
import ArtisButton from "../components/buttons/button";
import DeleteCollabDialog from "../components/dialogs/delete-collab";
import ConfirmCollabDialog from "../components/dialogs/confirm-collab";
import Government from "../components/work/edit/collapsibles/government";
import GPSLocation from "../components/work/edit/collapsibles/gps-location";
import Fade from '@mui/material/Fade';

export default function WorkEdit() {
  const defaultCollab = {
    showBanner: false,
    text: "",
    backgroundColor: "",
    textColor: "white",
    addApproveBtn: false,
    addDeleteButton: false,
  };
  const { user, setUser } = useUser();
  const [work, setWork] = useState(null);
  const [profile, setProfile] = useState(null);
  const [openId, setOpenId] = useState("");
  const [collabStatus, setCollabStatus] = useState(defaultCollab);
  const [allCollabs, setAllCollabs] = useState(null);
  const [allCollabsbyWork, setAllCollabsbyWork] = useState(null);
  const [isCollabDialogOpen, setIsCollabDialogOpen] = useState(false);
  const [confirmDialog, setIsConfirmDialogOpen] = useState({
    isVisible: false,
    type: "",
  });
  const [allCommunity, setAllCommunity] = useState([]);
  const [selfOwnership, setSelfOwnership] = useState(100);
  const [onCopyRight, setOnCopyRight] = useState("original");
  const [userMode, setUserMode] = useState("original");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState("");
  const [myTags, setMyTags] = useState([]);

  const [openImage, setOpenImage] = useState(false);
  const [image, setImage] = useState("false");

  const { artis_code } = useParams();
  const history = useHistory();
  
  const getArtistType = () => {
    if (work?.artist_type) return work.artist_type;
    else if (profile?.artist_type) return profile?.artist_type;
    return "Artist";
  };

  const fetchWork = async (artis_code) => {
    const response = await WorkService.getWork(artis_code);
    const { work, user } = response?.result;
    return {
      work,
      user,
    };
  };

  const fetchCollabs = async (newWork = null) => {
    const response = await WorkService.getCollaboratorStatus();
    const sendbody = {
      work_id: work.id,
      artis_code: work.artis_code,
      emails: work.emails,
    };
    const response_allcollabyId = await WorkService.getCollaboratorById(
      sendbody
    );
    if (response.result) {
      const selectedWork = newWork ?? work;

      const sameWork = response.result.find(
        (res) => res.work.id === selectedWork.id
      );
      
      const allCollabs = response.result.filter(
        (res) =>
          res.work.id === selectedWork.id &&
          res.registered_by_id === user.profile.user.id
      );
      
      setAllCollabs(allCollabs);
      var allCollabsbyWork = response_allcollabyId.result;
      
      if (allCollabsbyWork.length === 1) {
        const myprofile = allCollabsbyWork[0].profile;
        const query = `?q=detail&id=${myprofile.user_id}`;
        fetchFameData(query, myprofile.user_id, "detail");
      } else {
        var ids = allCollabsbyWork[0].profile.user_id;
        for (var i = 1; i < allCollabsbyWork.length; i++) {
          var collaborator = allCollabsbyWork[i];
          ids += "," + collaborator.profile.user_id;
        }
        const query = `?q=multiple&id=${ids}`;
        fetchFameData(query, ids, "multiple");
      }
      setAllCollabsbyWork(allCollabsbyWork);
      allCollabs.length === 0
        ? sameWork
          ? setSelfOwnership(sameWork.ownership)
          : setSelfOwnership(100)
        : setSelfOwnership(work.ownership);
      allCollabs.length === 0
        ? sameWork
          ? sameWork.oncopyright
            ? setOnCopyRight("collaborator_true")
            : setOnCopyRight("collaborator_false")
          : setOnCopyRight("original")
        : setOnCopyRight("original");
        
      // set  tags
      if (work.emails === user.profile.email) {
        // user is original
        setUserMode("original");
        let temp = [];
        temp.push(...work?.tags);
        setMyTags(temp);
      } else {
        // user is collaborator
        setUserMode("collaborator");
        const body = {
          collaborator_id: user?.profile?.id,
          work_id: work?.id,
        };
        const response_tags = await WorkService.getTagsById(body);

        const results = response_tags?.result;
        const collaborator_tags_string = results[0]?.searchtabs;
        var collaborator_tags_array = [];
        if (collaborator_tags_string)
          collaborator_tags_array = JSON.parse(collaborator_tags_string);

        let temp = [];
        temp.push(...collaborator_tags_array);
        setMyTags(temp);
      }
      if (
        sameWork &&
        sameWork.registered_by_id === user.profile.user.id &&
        !selectedWork.registered_on_blockchain
      ) {
        setCollabStatus({ addDeleteButton: true });
      }
      if (
        sameWork &&
        sameWork.collaborator.user_id === user.profile.user.id &&
        !sameWork.signed &&
        !selectedWork.rejected_collab
      ) {
        setCollabStatus({
          showBanner: true,
          text: "To register this work permanently on the blockchain and issue a Certificate of Copyright Registration, you’ll need to confirm your participation.",
          backgroundColor: "#fffde7",
          addApproveBtn: true,
        });
      }
      if (
        sameWork &&
        sameWork.registered_by_id === user.profile.user.id &&
        sameWork?.work.rejected_collab
      ) {
        setCollabStatus({
          showBanner: true,
          text: "A collaborator declined. This work cannot be registered on the blockchain.",
          backgroundColor: "#ffebee",
          addDeleteButton: true,
        });
      }
    }
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
    if (work) {
      fetchCollabs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work]);

  useEffect(() => {
    if (artis_code) {
      fetchWork(artis_code).then(({ work, user }) => {
        setWork(work);
        setProfile(user);
        document.title = "Artis.app | " + work?.title;
      });
    }
  }, [artis_code]);

  const updateStatement = async (statement) => {
    if (onCopyRight !== "original") {
      setModalState("statement");
      setIsModalOpen(true);
    } else {
      const response = await WorkService.updateWork(artis_code, {
        artist_statement: statement,
      });
      if (response?.result) {
        setWork({
          ...work,
          artist_statement: response.result.artist_statement,
        });
      }
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

  const handleTagsUpdate = async (tags) => {
    if (userMode === "original") {
      const response = await WorkService.updateWork(artis_code, { tags });
      if (response?.result) {
        setWork({
          ...work,
          tags: response.result.tags,
        });
      }
    } else {
      const body = {
        tags: JSON.stringify(tags),
        collaborator_id: user?.profile?.id,
        work_id: work?.id,
      };
      await WorkService.updateTagsById(body);
      setWork({
        ...work,
        tags: tags,
      });
    }
  };

  const handleWarningEmail = async (body) => {
    const response = await WorkService.sendWarningEmail(artis_code, body);
    if (response?.result?.success) return response.result.previous;
    return [];
  };

  const getWarnings = async () => {
    const response = await WorkService.getPreviousWarnings(artis_code);
    if (response?.result) return response.result;
    return [];
  };

  const handlePutOnSale = async (price, saleDescription) => {
    if (onCopyRight === "original") {
      const response = await WorkService.updateWork(work.artis_code, {
        sold_price: price,
        sold_tx_hash: "0",
        sale_description: saleDescription,
      });
      if (response?.result) {
        setWork({
          ...work,
          sold_price: response.result.sold_price,
          sold_tx_hash: response.result.sold_tx_hash,
        });
        return true;
      }
      return false;
    } else setIsModalOpen(true);
  };

  const updateWork = () => {
    if (onCopyRight === "original") {
      fetchWork(artis_code).then(({ work, user }) => {
        setWork(work);
      });
    } else setIsModalOpen(true);
  };

  const handleSale = async (buyer, email) => {
    if (onCopyRight === "original") {
      const response = await WorkService.updateWork(work.artis_code, {
        sold_buyer: buyer,
        sold_email: email,
      });
      if (response?.result?.success) {
        return true;
      }
      return false;
    } else {
      setModalState("start a sale");
      setIsModalOpen(true);
    }
  };

  const handleCancelSale = async () => {
    const response = await WorkService.updateWork(work.artis_code, {
      sold_price: 0,
      sold_tx_hash: null,
      sale_description: null,
    });
    if (response?.result) {
      setWork({
        ...work,
        sold_price: response.result.sold_price,
        sold_tx_hash: response.result.sold_tx_hash,
      });
      return true;
    }
    return false;
  };

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

  const downloadQR = () => {
    const canvas = document.getElementById(work?.artis_code);
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${work?.artis_code}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (!work || !profile) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  const handleCollabSign = async (signed) => {
    try {
      await WorkService.updateCollab({
        signed,
        work_id: work.id,
        collaborator_id: user.profile.user.id,
      });
    } catch (error) {}
  };

  const handleOpenImage = (value) => {
    setImage(value);
    setOpenImage(true);
  };

  return (
    <div>
      <>
        {collabStatus.showBanner && (
          <Box
            sx={{
              display: "flex",
              flexFlow: "row wrap",
              backgroundColor: `${collabStatus?.backgroundColor}`,
              padding: "5px",
              margin: "20px 0",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "gray", fontSize: "18px" }}>
              {collabStatus.text}
            </Typography>
          </Box>
        )}
      </>
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              overflow: "hidden",
              boxShadow: 1,
              fontWeight: "bold",
              mb: 5,
              pb: 3,
            }}
          >
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
                  sx={{
                    width: "auto",
                    maxHeight: "70vh",
                    cursor: "pointer",
                  }}
                  alt={work?.description}
                  src={work?.work_image?.image}
                />
              </div>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                m: 3,
                minWidth: { md: 350 },
              }}
            >
              <Box
                component="h1"
                sx={{
                  fontSize: "1.7rem",
                  mt: 1,
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {work?.title}
              </Box>
              <Box
                component="p"
                sx={{
                  fontSize: "1.6rem",
                  fontFamily: "Bellefair, serif",
                  fontWeight: "normal",
                }}
              >
                {work?.description}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                ml: 3,
                mb: 3,
                fontWeight: "normal",
                fontSize: "1.2rem",
                fontFamily: "Bellefair, serif",
              }}
            >
              <Box
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
                  <Box>
                    <Box component="p" display="inline" color="gray">
                      Copyright:{" "}
                    </Box>
                    <Box component="span" display="inline">
                      {utils.formatDate(work?.copyright_date)}
                    </Box>
                  </Box>
                  <Box>
                    <Box component="p" display="inline" color="gray">
                      Artis Code:{" "}
                    </Box>
                    <Box component="span" display="inline">
                      <Link
                        to={{
                          pathname: `/works/${work?.artis_code}`,
                          work,
                          profile,
                        }}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        {work?.artis_code}
                      </Link>
                    </Box>
                  </Box>
                  <Box>
                    <Box component="p" display="inline" color="gray">
                      Registered:{" "}
                    </Box>
                    <Box component="span" display="inline">
                      {utils.formatDate(work?.registered_date)}
                    </Box>
                  </Box>
                  <Box>
                    <Box component="p" display="inline" color="gray">
                      You Own:
                    </Box>
                    <Box component="span" display="inline">
                      &nbsp;{selfOwnership}%
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  gridRow: "2",
                  alignItems: "center",
                  textAlign: "center",
                  mr: 0,
                }}
              >
                <Link
                  to={`/works/${work?.artis_code}`}
                  style={{
                    textDecoration: "none",
                    fontSize: "1.2rem",
                  }}
                >
                  VIEW PROOF of <br />
                  COPYRIGHT <br />
                  REGISTRATION
                </Link>
              </Box>
            </Box>

            <br />
            
            {allCollabsbyWork && allCollabsbyWork.length !== 1 ? (
              <Box
                component="p"
                display="inline"
                color="gray"
                sx={{ marginLeft: "22px" }}
              >
                Collaborators
              </Box>
            ) : (
              <Box
                component="p"
                display="inline"
                color="gray"
                sx={{ marginLeft: "22px" }}
              >
                Registered by
              </Box>
            )}
            {allCollabsbyWork && (
              allCollabsbyWork.map((data, index) => (
                <Bio
                  openId={openId}
                  setOpenId={setOpenId}
                  collaborator_id={data?.profile?.id}
                  contribution={data?.collaborator?.contribution}
                  ownership={data?.collaborator?.ownership}
                  oncopyright={data?.collaborator?.oncopyright}
                  bio={data?.profile?.artist_bio}
                  sign_status={
                    data?.collaborator.hasOwnProperty("work_creator")
                      ? ""
                      : data?.collaborator?.sign_status
                  }
                  isEdit={
                    user.profile.user.id === data.profile.user_id ? true : false
                  }
                  is_kyced={data?.collaborator?.is_kyced}
                  website={data?.profile?.artist_website}
                  photo={
                    data?.profile?.photo
                      ? `https://artis-stage-data.s3.amazonaws.com/static/${data?.profile?.photo}`
                      : ""
                  }
                  first_name={data?.profile?.first_name.toUpperCase()}
                  last_name={data?.profile?.last_name.toUpperCase()}
                  token={user?.access}
                  signed={
                    data.collaborator.hasOwnProperty("signed")
                      ? data.collaborator.signed
                      : true
                  }
                  handleBioUpdate={handleBioUpdate}
                  artist_type={data?.collaborator?.contribution}
                  allCollabs={allCollabsbyWork}
                  subCollabs={allCollabs}
                  allCommunity={
                    <Box>
                      <Box
                        component="p"
                        display="inline"
                        color="gray"
                        sx={{ marginLeft: "0px" }}
                      >
                        creative community
                      </Box>
                      {allCommunity[index]?.verified_connections.length === 0 &&
                        allCommunity[index].unverified_connections.length ===
                          0 && (
                          <Typography>No community connections yet</Typography>
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
                  organization={data?.profile?.organization}
                  onEditPage={true}
                />
              ))
            )}

            <br />
            {collabStatus?.addDeleteButton && (
              <Box>
                <ArtisButton
                  name="Delete Work"
                  onClick={async () => {
                    setIsCollabDialogOpen(true);
                  }}
                  id="delete"
                  sx={{
                    fontSize: "1.5rem",
                  }}
                  textColor="red"
                />
              </Box>
            )}
            {collabStatus?.addApproveBtn && (
              <Box>
                <ArtisButton
                  name="Accept Collaboration"
                  onClick={async () => {
                    setIsConfirmDialogOpen({
                      isVisible: true,
                      type: "approve",
                    });
                  }}
                  id="cancel"
                  sx={{
                    fontSize: "1.5rem",
                  }}
                  textColor="green"
                />
                <ArtisButton
                  name="Decline Collaboration"
                  onClick={async () => {
                    setIsConfirmDialogOpen({ isVisible: true, type: "reject" });
                  }}
                  id="cancel"
                  sx={{
                    fontSize: "1.5rem",
                  }}
                  textColor="red"
                />
              </Box>
            )}
            <br />

            <Statement
              statement={work?.artist_statement}
              openId={openId}
              setOpenId={setOpenId}
              updateStatement={updateStatement}
              artist_type={getArtistType()}
            />

            <Sell
              openId={openId}
              setOpenId={setOpenId}
              sold_tx_hash={work?.sold_tx_hash}
              sold_buyer={work?.sold_buyer}
              sold_price={work?.sold_price}
              sold_email={work?.sold_email}
              sold_date={work?.sold_date}
              sale_description={work?.sale_description}
              title={work?.title}
              handleSale={handleSale}
              handlePutOnSale={handlePutOnSale}
              handleCancelSale={handleCancelSale}
              updateWork={updateWork}
            />

            <Tags
              openId={openId}
              setOpenId={setOpenId}
              chips={myTags}
              tags={myTags}
              usermode={userMode}
              handleTagsUpdate={handleTagsUpdate}
              options={user?.profile?.default_tags || []}
            />

            <Email
              openId={openId}
              setOpenId={setOpenId}
              artis_code={work?.artis_code}
              copyright_date={work?.copyright_date}
              copyright_owner={work?.copyright_owner}
              tx_hash={work?.tx_hash}
              title={work?.title}
              work_creator={work?.work_creator}
              handleWarningEmail={handleWarningEmail}
              getPreviousWarnings={getWarnings}
            />

            <VerifyWork
              openId={openId}
              setOpenId={setOpenId}
              fileSize={work?.work_copy_size}
              fileName={work?.work_copy_name}
              registeredDate={work?.registered_date}
              id={work?.id}
              handleVerify={handleVerify}
            />

            <Blockchain
              openId={openId}
              setOpenId={setOpenId}
              sold_tx_hash={work?.sold_tx_hash}
              tx_hash={work?.tx_hash}
              work_copy_fingerprint={work?.work_copy_fingerprint}
            />

            <GPSLocation
              openId={openId}
              setOpenId={setOpenId}
              location={work?.location}
            />

            <Government
              openId={openId}
              setOpenId={setOpenId}
              sold_tx_hash={work?.sold_tx_hash}
              tx_hash={work?.tx_hash}
              work_copy_fingerprint={work?.work_copy_fingerprint}
              artis_code={artis_code}
              onCopyRight={onCopyRight}
              hidden={false}
              onEdit={true}
            />

            {/* <Customize
              openId={openId}
              setOpenId={setOpenId}
              artist_type={getArtistType()}
              hide_info={work?.hide_artist_info}
              updateArtistType={updateArtistType}
            /> */}
            <br />

            <Modal open={isModalOpen} onClose={(e) => setIsModalOpen(false)}>
              <Box
                sx={{
                  width: 400,
                  height: 164,
                  backgroundColor: "white",
                  margin: "auto",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  padding: "30px 20px",
                }}
              >
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2, color: "black" }}
                >
                  Only the original person who registered this work can change
                  the {modalState}
                </Typography>
                <Button
                  onClick={(e) => setIsModalOpen(false)}
                  sx={{ float: "right", marginRight: "20px", marginTop: "5px" }}
                >
                  OK
                </Button>
              </Box>
            </Modal>
            <DeleteCollabDialog
              handleClose={() => setIsCollabDialogOpen(false)}
              open={isCollabDialogOpen}
              deleteWorkAndCollab={async () => {
                try {
                  await WorkService.deleteWorkAndCollab(work.id);
                  history.push("/works");
                } catch (error) {}
              }}
            />
            {confirmDialog?.isVisible && (
              <ConfirmCollabDialog
                handleClose={() =>
                  setIsConfirmDialogOpen({ isVisible: false, type: "" })
                }
                open={confirmDialog?.isVisible}
                approveText={
                  confirmDialog?.type === "approve" ? "approve" : "reject"
                }
                onAccept={async () => {
                  if (confirmDialog?.type === "approve") {
                    setCollabStatus(defaultCollab);
                    await handleCollabSign(true);
                    const { work } = await fetchWork(artis_code);
                    await fetchCollabs(work);
                    setIsConfirmDialogOpen({ isVisible: false, type: "" });
                  }

                  if (confirmDialog?.type === "reject") {
                    setCollabStatus(defaultCollab);
                    await handleCollabSign(false);
                    const { work } = await fetchWork(artis_code);
                    await fetchCollabs(work);
                    history.push("/works");
                    setIsConfirmDialogOpen({ isVisible: false, type: "" });
                  }
                }}
              />
            )}
            {/* <br />
            <br /> */}
            <Box mt={5} >
              <Box component="p" ml={3} mr={3} fontSize="20px">
                <strong>SEND PROOF OF COPYRIGHT REGISTRATION</strong>
                {/* <br />
                <br /> */}
                <Box component="p" ml={3} mr={3} fontSize="15px" mt={5}>
                  By <strong>Link</strong>: <br />
                  Email a link that sends people directly to your Proof.
                  <br />
                  <br />
                  <em>Link:</em> https://artis.app/works/{work?.artis_code}
                  <Tooltip title="Copy Link to Proof of Registration">
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://artis.app/works/${work?.artis_code}`
                        );
                        toast.success(
                          "Link to the Proof copied to clipboard!",
                          {
                            position: "bottom-left",
                            autoClose: 2000,
                            hideProgressBar: true,
                          }
                        );
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                {/* <br /> */}

                <Box component="p" ml={3} mr={3} fontSize="15px"  mt={4}>
                  By <strong>ArtisCode</strong>: <br />
                  Inputing your Proof of Copyright Registration's ArtisCode into
                  Artis.app's front page, sends people to your Proof. Code is
                  easy to add to front pages of documents and scripts.
                  <br />
                  <br />
                  <em >ArtisCode: </em> {work?.artis_code}
                  <Tooltip title="Copy Artis Code">
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(work?.artis_code);
                        toast.success(`Aris Code copied to clipboard!`, {
                          position: "bottom-left",
                          autoClose: 2000,
                          hideProgressBar: true,
                        });
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                {/* <br /> */}

                <Box component="p" ml={3} mr={3} fontSize="15px"  mb={4} mt={4}  >
                  By <strong>QRCode</strong>: <br />
                  QR Code below is encoded wtih a link to your Proof of
                  Copyright Registration. Attach this QR code to your original
                  and when people scan it with mobile phones, your Proof of
                  Copyright Registration will automatically appear.
                  {/* <br />
                  <br /> */}
                  <div align="center" className="mt-4">
                    <iframe
                      title="QR code explainer"
                      src="https://player.vimeo.com/video/755622176?h=1b0c5ce2f4"
                      width="300"
                      height="300"
                      style={{ boxShadow: "1px 2px 5px #AAAAAA" }}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                  {/* <br /> */}
                  <Box component="p" ml={3} mr={3}  mt={3}>
                    <div align="center">
                      <a
                        onClick={downloadQR}
                        style={{
                          color: "black",
                          cursor: "pointer",
                          fontSize: "1rem",
                        }}
                      >
                        <QRCode
                          id={work?.artis_code}
                          value={`https://artis.app/works/${work?.artis_code}`}
                          size={100}
                        />
                        <br />
                        Click on QR code to download.
                      </a>
                    </div>
                  </Box>
                </Box>
                {/* <br /> */}

                <Box component="p" ml={3} mr={3} fontSize="15px"> 
                  By <strong>NFC </strong>:
                  <br />
                  Mobile phones automatically scan NFC tags and load up weblinks
                  stored within. Apps used to encode weblinks into NFCs and NFC
                  tags are inexpensive.
                  {/* <br />
                  <br /> */}
                  <div align="center" className="mb-3 mt-3">
                    <iframe
                      title="explainer"
                      src="https://player.vimeo.com/video/754282297?h=dc4c3f484f"
                      width="300"
                      height="300"
                      style={{ boxShadow: "1px 2px 5px #AAAAAA" }}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                  {/* <br /> */}
                  Encode the link below into an NFC tag and attach the tag to
                  your work.
                  <br />
                  <em>NFC Link:</em> https://artis.app/works/{work?.artis_code}
                  <Tooltip title="Copy NFC Link">
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://artis.app/works/${work?.artis_code}`
                        );
                        toast.success("NFC Link copied to clipboard!", {
                          position: "bottom-left",
                          autoClose: 2000,
                          hideProgressBar: true,
                        });
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Box>
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
