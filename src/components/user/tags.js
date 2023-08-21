import CloudOutlined from "@mui/icons-material/CloudOutlined";
import { useState } from "react";
import CollapsibleBody from "../collapsible";
import TagsField from "../inputs/chips-new";
import ArtisButton from "../buttons/button";
import Loader from "../buttons/loader";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function DefaultTags(props) {
  // create two states: defaultTags, tags
  const [defaultTags, setDefaultTags] = useState(props.defaultTags);
  const [tags, setTags] = useState(props.tags);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await props.handleUpdateTags(tags, defaultTags);
    setIsLoading(false);
  };

  return (
    <CollapsibleBody
      expanded={props.openId === "default_tags"}
      id="default_tags"
      title="Search Tags"
      icon={<CloudOutlined />}
      handleClick={props.setOpenId}
      mainSx={{
        //alignItems: "stretch",
        //fontFamily: "'Bellefair', sans-serif;",
        fontWeight: "normal",
      }}
    >
      
      {/* <br /> */}
      <div align="center" className="mb-5 mt-4">
            <iframe title="explainer" src="https://player.vimeo.com/video/769952597?h=089ae54b99" width="300" height="300" style={{boxShadow: '1px 2px 5px #AAAAAA',}}  allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
      </div>
      {/* <br />
      <br />       */}
      <div>
             <center>
                 <h3>All your Search Tags</h3>
            </center>
       </div>
 
      <Box mt={3} fontSize="1.2rem">
        <Typography m={3}>
          Below as tags that Artis.app auto-completes for you. Anytime you use a
          new tag, Artis.app adds it to the list below. Add and remove from list
          as needed.{" "}
        </Typography>
      </Box>

      <TagsField
        chips={tags}
        options={defaultTags}
        setChips={setTags}
        name="All available Tags"
        
        sx={{
          m: 3,
          fontSize: "1.5rem",
        }}
      />
      {/* <br /> */}
        
      <div className="mt-4">
             <center>
                 <h3>Default registration Search Tags</h3>
            </center>
       </div>
      

      <Box mt={3} fontSize="1.2rem">
        <Typography m={3}>
          Tags below load automatically during new registrations. For example,
          if you constantly add a PDF tag to registrations, save a bit of time,
          add it below and Artis.app will automatically load it for new
          registrations.{" "}
        </Typography>
      </Box>

      <TagsField
        chips={defaultTags}
        options={tags}
        setChips={setDefaultTags}
        name="Default Registration Tags"
        placeholder="Default tags"
        sx={{
          m: 3,
          fontSize: "1.5rem",
        }}
      />
      <Loader isLoading={isLoading} />
      <ArtisButton
        name="Update"
        type="submit"
        textColor="teal"
        onClick={handleSubmit}
        sx={{
          fontSize: "1.5rem",
          mb: 3,
        }}
      />
    </CollapsibleBody>
  );
}
