import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Slide, Container, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Settings } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useHistory } from "react-router-dom";
import { Fab } from "react-tiny-fab";

import ArtisButton from "../components/buttons/button";
import { useWorks } from "../hooks/works";
import { useUser } from "../hooks/user";
import useMobileCheckScreen from "../hooks/isMobile";
import ArtisFooter from "../components/footer";
import WorkRights from "./work-rights";
import WorksAcquired from "./works-acquired";
import Fame from '../components/tabs/Fame'
import UserService from "../api/auth";
import { WorkService } from "../api";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TAB_TYPES = {
  COPYRIGHTS: 0,
  LICENSES: 1,
  CERTIFICATES: 2,
  FAME: 3,
}

function Works() {
  const history = useHistory();
  const { user } = useUser();

  const [tab, setTab] = useState(0);
  const [isPendingFame, setIsPendingFame] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false);
  const [isPendingCollabSign, setIsPendingCollabSign] = useState(false)
  const [collabs, setCollabs] = useState(null)

  const isMobile = useMobileCheckScreen(380);

  const {
    works,
    curPage,
    worksPerPage,
    count,
    queryForm,
    setCurPage,
    setWorksPerPage,
    setSort,
    setQueryForm,
    isQueryActive,
    setIsQueryActive,
    view,
    setView,
    worksIsLoading
  } = useWorks();
  
  const theme = useTheme();

  useEffect(() => {
    const getFame = async () => {
      try {
        const response = await UserService.getFameConnections()
        if (response.result.pending_fame?.length > 0) {
          setIsPendingFame(true)
        }
      } catch (error) {

      }
    }
    getFame()
  }, []);

  useEffect(() => {
    const getCollabStatus = async () => {
      if (works && !collabs) {
        try {
          const res = await WorkService.getCollaboratorStatus()
          if (res.result) {
            const shouldSign = res.result.some(r => {
              return !r.signed && r.collaborator.user_id === user.profile.user.id && !r.work.rejected_collab
            })
            setIsPendingCollabSign(shouldSign)
            setCollabs(res.result)
          }
        } catch (error) {

        }
      }
    }
    getCollabStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [works]);

  useEffect(() => {
    document.title = "ARTIS.app";
    const { location } = history
    if (location.hash) {
      const hash = location.hash.split('#')[1]
      setTab(TAB_TYPES[hash.toUpperCase()])
      window.scroll(0, 0)
    }
  }, [history]);

  const onPageChange = (event, value) => {
    setCurPage(value);
  };

  const handleFilter = (data) => {
    setQueryForm(data);
    setFilterOpen(false);
  };

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div>
      {
        count > 0 && !user.profile.user.is_kyced &&
        <Box 
          sx={{ 
            display: 'flex', 
            flexFlow: "row wrap", 
            backgroundColor: '#e8f5e9', 
            padding: "5px", 
            margin: "20px 0", 
            justifyContent: "center" 
          }}
        >
          <Typography 
            sx={{ 
              color: '#2e7d32', 
              fontSize: "18px" 
            }}
          >
            Verify your indentity <span style={{ textDecoration: "underline", cursor: "pointer", color: "#2e7d32" }} onClick={() => history.push('/settings?get_verified')}>here</span>
          </Typography>
        </Box>
      }
      {
        isPendingCollabSign &&
        <Box 
          sx={{ 
            display: 'flex', 
            flexFlow: "row wrap", 
            backgroundColor: '#fffde7', 
            padding: "5px", 
            margin: "20px 0", 
            justifyContent: "center" 
          }}
        >
          <Typography sx={{ color: 'b9cdb9', fontSize: "18px" }}>Accept or Decline Collaboration Invitations</Typography>
        </Box>
      }
      <Slide in={true} mountOnEnter unmountOnExit direction="right">
        <Container maxWidth="lg">
          <div style={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  fontSize: "1.8rem",
                  fontFamily: "Bellefair, serif",
                }}
              >
                <Tabs
                  value={tab}
                  onChange={handleChange}
                  textColor="inherit"
                  sx={{
                    fontFamily: "Bellefair, serif",
                  }}
                >
                  <Tab
                    sx={{ fontSize: isMobile ? "0.6rem" : "0.9rem" }}
                    label="Works"
                    {...a11yProps(0)}
                  />
                  <Tab
                    sx={{ fontSize: isMobile ? "0.6rem" : "0.9rem" }}
                    label="Rights"
                    {...a11yProps(1)}
                  />
                  <Tab
                    sx={{ fontSize: isMobile ? "0.6rem" : "0.9rem" }}
                    label="C of A"
                    {...a11yProps(2)}
                  />
                  <Box onClick={() => setTab(TAB_TYPES.FAME)} sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center", position: "relative" }}>
                    <Tab
                      sx={{ fontSize: isMobile ? "0.6rem" : "0.9rem" }}
                      label="Community"
                      {...a11yProps(3)}
                    />
                    {
                      isPendingFame &&
                      <div 
                        style={{ 
                          height: "10px", 
                          width: "10px", 
                          background: "blue", 
                          position: "absolute", 
                          right: 0 
                        }}
                      ></div>
                    }
                  </Box>
                </Tabs>
              </Box>
            </Box>
          </div>
          {
            tab === TAB_TYPES.COPYRIGHTS ?
            <WorkRights
              theme={theme}
              user={user}
              works={works}
              curPage={curPage}
              worksPerPage={worksPerPage}
              setWorksPerPage={setWorksPerPage}
              count={count}
              queryForm={queryForm}
              setSort={setSort}
              setQueryForm={setQueryForm}
              isQueryActive={isQueryActive}
              setIsQueryActive={setIsQueryActive}
              onPageChange={onPageChange}
              isMobile={isMobile}
              handleFilter={handleFilter}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              setView={setView}
              view={view}
              history={history}
              collabs={collabs}
              worksIsLoading={worksIsLoading}
            /> :
            <>
            {
              tab === TAB_TYPES.FAME ? 
              <Fame 
                theme={theme} 
                setIsPendingFame={setIsPendingFame} 
              /> : 
              <WorksAcquired />
            }
            </>
          }
          <Box m={3}>
            <ArtisButton
              id="invite"
              onClick={() => history.push("/settings?invite")}
              sx={{
                fontSize: "1.5rem",
              }}
              name="Invite Creatives to Artis.app"
            />
          </Box>
          <Box textAlign="center" m={3}>
            <Settings
              fontSize="large"
              onClick={() => history.push("/settings")}
            />
            <ArtisButton
              id="settings"
              onClick={() => history.push("/settings")}
              sx={{
                fontSize: "1.2rem",
                fontColor: "grey",
              }}
              name="Settings"
            />
          </Box>
          <ArtisFooter />
        </Container>
      </Slide>
      {
        tab === 0 &&
        <Fab
          mainButtonStyles={{
            backgroundColor: "#00b5ad",
          }}
          style={{
            bottom: 20,
            right: 10,
          }}
          icon={<AddIcon />}
          event="hover"
          alwaysShowTitle={false}
          onClick={() => history.push("/works/new")}
        />
      }
    </div>
  );
}

export default Works;
