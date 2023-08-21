import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Link from "@mui/material/Link";
import ListHeader from "../components/worklist/appbar";
import QueryFormDialog from "../components/dialogs/filter";
import Work from "../components/work";
import WorksIconView from "../components/worklist/image-list";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";

const LinkStyle = {
  fontSize: "1.2rem",
  border: "none",
  cursor: "pointer",
  m: 2,
  color: "blue",
};

export default function WorkRights(props) {
  const {
    user,
    works,
    setView,
    queryForm,
    isQueryActive,
    setIsQueryActive,
    onPageChange,
    handleFilter,
    setSort,
    setWorksPerPage,
    filterOpen,
    setFilterOpen,
    isMobile,
    curPage,
    worksPerPage,
    count,
    view,
    collabs,
    worksIsLoading
  } = props;

  const [isLoading, setIsLoading] = React.useState(true)


  // set works per page to 20, 1 seccond after component mounts
  useEffect(() => {
    // wait 2 seconds
    const timeout = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setWorksPerPage(20);
      setIsLoading(false)
    }
    timeout();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "",
        mt: "2%",
        overflow: "hidden",
        display: "grid",
        boxShadow: 2,
        backgroundSize: "cover",
        backgroundPosition: "0 400px",
      }}
    >
      <ListHeader
        setViewValue={setView}
        setSortValue={setSort}
        handleQueryForm={() => setFilterOpen(true)}
        queryForm={queryForm}
        handleFilter={handleFilter}
        isQueryActive={isQueryActive}
        setIsQueryActive={setIsQueryActive}
        isMobile={isMobile}
      />
      <QueryFormDialog
        queryForm={queryForm}
        open={filterOpen}
        handleClose={() => setFilterOpen(false)}
        handleSubmit={handleFilter}
        suggestedTags={user?.profile?.default_tags}
        setIsQueryActive={setIsQueryActive}
      />
      <Divider />
      <Grid
        direction="column"
        alignItems="stretch"
        container
        sx={{
          mb: 1,
        }}
      >
        {
          count && !isLoading ?
          Object.keys(works).map((key) => (
            <React.Fragment key={key}>
              <Divider />
              <Typography fontSize="1.6rem" color="gray" pl={3}>
                { key }
              </Typography>
              {
                view === "list" ?
                works[key].map((work) => (
                  <Work
                    key={work.tx_hash}
                    history={props.history}
                    work={work}
                    profile={user?.profile}
                    isMobile={isMobile}
                    collabs={collabs}
                  />
                )) :
                <WorksIconView works={works[key]} profile={user?.profile} />
              }
            </React.Fragment>
          )) :
          worksIsLoading ?
          <Container style={{ textAlign: "center", justifyContent: "center", marginTop: 30 }}>
            <CircularProgress thickness={1.8} size="3.5rem" color="success" />
          </Container> :
          <Box style={{ textAlign: 'center' }} mt={4}>
            {/* <br />
            <br /> */}
            <img
              alt="Artis.app Earth"
              src="https://artis.app/images/color_earth.jpg"
            />
            {/* <br /> */}
            <Typography 
              mt={2} mb={4}
              fontSize={isMobile ? "1rem" : "1.2rem"}
              color="black"
              m={4}
              pl={4}
              sx={{
                textAlign: "center",
              }}
            >
              Welcome to the global community of artists who EASILY and INSTANTLY register and protect their creativity onto the blockchain.
              <br />
              <br />
              Artis.app creates DIGITAL FINGERPRINTS of the work, then stores those fingerprints on the blockchain for FREE.
              <br />
              <br />
              Anybody, anywhere in the world can use your registration to indisputably prove what you created and when.
              <br />
              <br />
              Press the round teal + button to register your first work and create its Certificate of Registration.{" "}
            </Typography>
            {/* <br />
            <br /> */}
          </Box>
        }
      </Grid>
      <Grid
        direction={isMobile ? "row" : "column"}
        container
        columns={isMobile ? 1 : 2}
        sx={{
          flexGrow: 1,
          justifyContent: "center",
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
        }}
      >
        <Grid
          item
          xs={isMobile ? 0 : 1}
          textAlign={window.innerWidth ? "center" : "left"}
          sx={{
            alignSelf: isMobile ? "center" : "flex-start",
          }}
          m={isMobile ? 1 : 0}
        >
          <Stack>
            <Pagination
              variant="outlined"
              color="primary"
              size={isMobile ? "small" : "medium"}
              count={Math.ceil(count / worksPerPage)}
              page={curPage}
              onChange={onPageChange}
            />
          </Stack>
        </Grid>
        <Grid
          item
          xs={1}
          textAlign={isMobile ? "center" : "left"}
          sx={{
            alignSelf: isMobile ? "center" : "flex-end",
          }}
        >
          <Typography
            component="div"
            color="gray"
            sx={{
              marginLeft: 1,
            }}
          >
            Show:l
            <Link
              underline="none"
              sx={LinkStyle}
              onClick={() => setWorksPerPage(20)}
            >
              20
            </Link>
            |
            <Link
              underline="none"
              sx={LinkStyle}
              onClick={() => setWorksPerPage(50)}
            >
              50
            </Link>
            |
            <Link
              underline="none"
              sx={LinkStyle}
              onClick={() => setWorksPerPage(100)}
            >
              100
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
