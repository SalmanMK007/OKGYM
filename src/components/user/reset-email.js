 /* eslint-disable jsx-a11y/anchor-is-valid */
import Box from "@mui/material/Box";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { CloudOutlined } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import CollapsibleBody from "../collapsible";
import { FormikField } from "../../pages/signup";
import ArtisButton from "../buttons/button";
import Loader from "..//buttons/loader";
import axios from "../../api/axios";

const validationSchema = Yup.object().shape({
  new_email: Yup.string().email("Must be a valid email format").required(),
});

export default function ResetEmail(props) {
  const handleResetEmail = async (values) => {
    const { new_email } = values;
    try {
      await axios.post("/users/send-email-reset-mail/", {
        new_email,
        first_name: props.firstName,
        last_name: props.lastName,
        old_email: props.email,
      });
    } catch (error) {}
  };
  return (
    <CollapsibleBody
      expanded={props.openId === "reset-email"}
      id="reset-email"
      title="Change Email Address"
      icon={<CloudOutlined />}
      handleClick={props.setOpenId}
      mainSx={{
        alignItems: "flex-start",
        //fontFamily: "Bellefair, serif;",
        fontWeight: "normal",
        fontSize: "1.4rem",
      }}
    >
      <Box
        m={4}
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
          <div>
          <center>
            <Box component="p" color="gray" fontSize="1.3rem">
              Current email address:
            </Box>
            <Box component="p" fontSize="1.4rem">
              {props.email}
            </Box>
          </center>
          </div>
          <Box component="div" >
            <Box mt={3}  mb={3} fontSize="1.3rem" >
              <Typography  mb={2}> 
                You can change your email by entering a new one below and and
                pressing the "send" button.
              </Typography>
              {/* <br /> */}
              <Typography>
                We'll send a confirmation email to the new address.
                When you click on the link contained within the confirmation
                email, your email address will be
                changed and you can log back
                in under the new email
              </Typography>
            </Box>
            {/* <br /> */}
            <Formik
              initialValues={{ new_email: "" }}
              validationSchema={validationSchema}
              onSubmit={handleResetEmail}
              enableReinitialize
            >
              {({ isValid, dirty, handleSubmit, isSubmitting }) => (
                <Form>
                  <FormikField
                    options={{
                      name: "new_email",
                      label: "New email",
                      type: "email",
                    }}
                  />
                  <Loader isLoading={isSubmitting} />
                  <ArtisButton
                    disabled={!(isValid && dirty)}
                    onClick={handleSubmit}
                    name="Send"
                    size="medium"
                    id="sign_up"
                    sx={{
                      fontSize: "1.5rem",
                    }}
                  />
                </Form>
              )}
            </Formik>
          </Box>

          {/* <br /> */}
        </Box>
      </Box>
    </CollapsibleBody>
  );
}
