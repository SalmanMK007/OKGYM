import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import TagsIcon from "@mui/icons-material/Loyalty";

import TagsField from "../../../inputs/chips-new";
import CollapsibleBody from "../../../collapsible";
import ArtisButton from "../../../buttons/button";
import Loader from "../../../buttons/loader";

export default function Tags(props) {
  const { options, chips, handleTagsUpdate, ...other } = props;
  const [tags, setTags] = useState(chips || []);
  const [loading, setLoading] = useState(false);

  const _handleTagsUpdate = async () => {
    setLoading(true);
    await handleTagsUpdate(tags);
    setLoading(false);
  };

  useEffect(() => {
    if (props.chips) {
      setTags(props.chips);
    }
  }, [props]);

  return (
    <CollapsibleBody   
      expanded={other.openId === "tags-body"}
      id="tags-body"
      title={"Search Tags"}
      icon={<TagsIcon />}
      handleClick={other.setOpenId}
      mainSx={{}}
    >
      {/* <br /> */}
      <div align="center" className="mt-3">
        <iframe
          title="explainer"
          src="https://player.vimeo.com/video/769952597?h=089ae54b99"
          width="300"
          height="300"
          style={{ boxShadow: "1px 2px 5px #AAAAAA" }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <Box component="p" ml={3} mr={3} fontSize="15px" mt={4}>
        {/* <br /> */}
        To create a Search Tag, type in a word, then hit enter. You can have
        multiple Search Tags listed.
      </Box>
      <Box alignItems="stretch" justifyItems="center" p={3}>
        <TagsField
          chips={tags}
          options={options}
          setChips={setTags}
          name="Enter Search Tags here"
          sx={{
            fontSize: "1.3rem",
            mb: 3,
            mt: 3,
          }}
        />
      </Box>
      <Loader isLoading={loading} />
      <ArtisButton
        name="Update Search Tags"
        sx={{
          fontSize: "1.5em",
          mb: 3,
        }}
        onClick={_handleTagsUpdate}
      />
    </CollapsibleBody>
  );
}
