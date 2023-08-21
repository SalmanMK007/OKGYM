import Box from "@mui/material/Box";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import CollapsibleBody from "../../../collapsible";
import { useState } from "react";
import ArtisButton from "../../../buttons/button";
import ArtisInput from "../../../inputs/textfield";

export default function Statement(props) {
  const [statement, setStatement] = useState(props?.statement || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await props.updateStatement(statement);
  };
  return (
    <>
      <CollapsibleBody
        expanded={props.openId === "statement-body"}
        id="statement-body"
        title={`Statement`}
        icon={<RecordVoiceOverIcon />}
        handleClick={props.setOpenId}
        mainSx={{
          alignItems: "flex-start",
        }}
      >
        <Box component="p" ml={3} mr={3} fontSize="15px" mt={4}>
          {/* <br /> */}
          This statement appears on the Proof of Copyright Registration and can
          reflect what inspired the creation of this work or what the work means
          to its creators.
        </Box>

        <Box component="form" ml={3} mr={3} onSubmit={handleSubmit}>
          <ArtisInput
            label="Statement"
            value={statement}
            multiline
            onChange={(e) => setStatement(e.target.value)}
          />
          <ArtisButton
            name="Update Statement"
            sx={{
              fontSize: "1.5rem",
              mb: 3,
            }}
          />
        </Box>
      </CollapsibleBody>
    </>
  );
}
