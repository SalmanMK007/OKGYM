import { useEffect, useState, useRef, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router";
import { Container, CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import ArtisInput from "../components/inputs/textfield";
import ArtisButton from "../components/buttons/button";
import { AuthService } from "../api";
import { useUser } from "../hooks/user";
import Loader from "../components/buttons/loader";

export const FormikField = ({ options }) => {
  return (
    <Field name={options.name}>
      {({
        field, // { name, value, onChange, onBlur }
        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }) => (
        <>
          <ArtisInput
            label={options.label}
            disabled={options.disabled}
            type={options.type || "text"}
            onClick={options.onClick}
            {...options}
            {...field}
          />
          {meta.touched && meta.error && (
            <Typography color="red">{meta.error}</Typography>
          )}
        </>
      )}
    </Field>
  );
};

const initVal = {
  user: { password: "", confirmPassword: "", email: "", artist_type: "Artist" },
  profile: {
    first_name: "",
    last_name: "",
    organization: "",
    website: "",
    photo: null,
    photoName: "",
    bio: "",
  },
};

const validationSchema = Yup.object().shape({
  user: Yup.object().shape({
    password: Yup.string().required("Field is required").min(6, "Min 6 chars"),
    confirmPassword: Yup.string()
      .required("Field is required")
      .oneOf([Yup.ref("password"), null], "Password do not match"),
  }),
  profile: Yup.object().shape({
    first_name: Yup.string().required("Field is required"),
    last_name: Yup.string().required("Field is required"),
  }),
});

export default function SignUp(props) {
  const uploadRef = useRef();

  const { uid, inviteCode } = useParams();
  const userHook = useUser();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(initVal);
  const [errorData, setErrorData] = useState(null);

  const fetchUser = async () => {
    try {
      const result = await AuthService.signUpWithInviteCode(uid, inviteCode);
      setInitialValues({
        user: { ...initialValues.user, email: result?.user?.email },
        profile: { ...initialValues.profile, ...result?.profile },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCallback = useCallback(() => {
    if (uid && inviteCode) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, inviteCode]);
  useEffect(() => {
    fetchUserCallback();
  }, [fetchUserCallback]);

  const handleCreateAccount = async (values) => {
    setIsLoading(true);
    const { user, profile } = values;

    const userProfile = {
      ...profile,
      artist_bio: profile.bio,
      artist_website: profile.website,
    };
    const updatedUser = {
      ...user,
      username: `${profile.first_name}${profile.last_name}${profile.id}`,
    };
    const formData = new FormData();
    formData.append(`profile`, JSON.stringify(userProfile));
    formData.append(`user`, JSON.stringify(updatedUser));

    if (profile.photo) {
      formData.append(`photo`, profile.photo);
    }

    try {
      const response = await AuthService.signUp(uid, inviteCode, formData);
      if (response.error) {
        setErrorData({
          message: "Something went wrong. Please try again later.",
        });
      }
      if (response.result) {
        setIsLoading(false);
        if (response?.result?.is_active === true) {
          await userHook.login(
            user.email,
            user.password,
            profile.website,
            profile.bio,
            profile.photo
          );
          history.push("/");
        } else {
          history.push("/signup/verify");
        }
      }
    } catch (error) {
      setErrorData(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event, setFieldValue) => {
    if (event?.target && event.target?.files.length) {
      if (event.target.files[0].type.includes("image")) {
        setFieldValue("profile.photo", event.target.files[0]);
        setFieldValue("profile.photoName", event.target.files[0].name);
      }
    }
  };

  return (
    <Box
      sx={{
        pt: 0,
      }}
    >
      <Container maxWidth="sm" style={{ textAlign: "center" }}>
        <Box mt={2}>
          {/* <Typography
            component="h6"
            gutterBottom
            fontSize="2.5rem"
            align="center"
          >
            Artis.app
          </Typography> */}

          <img
            alt="Artis.app Logo"
            src="https://artis.app/images/Artis.png"
            loading="lazy"
          />

          <br />
          <br />

          {!initialValues.user?.email && (
            <>
              <Typography
                component="h6"
                gutterBottom
                fontSize="1.5rem"
                align="center"
              >
                Woops. You already signed-up using this invite.
              </Typography>
              <Loader isLoading={isLoading} />
              <ArtisButton
                name="Back to Login"
                size="medium"
                onClick={() => history.push("/login")}
                sx={{
                  fontSize: "1.5rem",
                }}
              />
            </>
          )}

          {initialValues.user?.email && (
            <>
               <Container>
                 <div align="center">
                   <iframe title="Artis Explainer Video" src="https://player.vimeo.com/video/751697323?h=9ea43f53f7" width="380" height="380" style={{boxShadow: '1px 2px 5px AAAAAA',}} frameborder="1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                 </div> 
                 <br />
                 <br />
                 <br />
              </Container>   
              <Typography
                component="h6"
                gutterBottom
                fontSize="1.5rem"
                align="center"
              >
                Complete the four steps below your get your free Artis.app account.
              </Typography>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleCreateAccount}
                enableReinitialize
              >
                {({ handleSubmit, isValid, setFieldValue, values, dirty }) => {
                  return (
                    <Form>
                      <Box alignItems="center" mr={5} ml={5} mt={2}></Box>
                      <Box textAlign="center" mb={3}>
                        <br />
                        <br />
                  
                   
                        <img
                          alt="Step One"
                          src="https://artis.app/images/Artis_one.jpg"
                          width="100px"
                          height="123px"
                        />
                        <p>Basic info</p>
                        <Box
                          display="grid"
                          gridTemplateColumns="1fr 1fr"
                          gap={4}
                        >
                          <Box gridColumn="span 1">
                            <FormikField
                              options={{
                                name: "user.password",
                                label: "Password",
                                type: "password",
                              }}
                            />
                          </Box>
                          <Box gridColumn="span 1">
                            <FormikField
                              options={{
                                name: "user.confirmPassword",
                                label: "Confirm Password",
                                type: "password",
                              }}
                            />
                          </Box>
                        </Box>
                        <Box
                          display="grid"
                          gridTemplateColumns="1fr 1fr"
                          gap={4}
                        >
                          <Box gridColumn="span 1">
                            <FormikField
                              options={{
                                name: "profile.first_name",
                                label: "First name",
                              }}
                            />
                          </Box>
                          <Box gridColumn="span 1">
                            <FormikField
                              options={{
                                name: "profile.last_name",
                                label: "Last name",
                              }}
                            />
                          </Box>
                        </Box>
                        <FormikField
                          options={{
                            name: "profile.organization",
                            label: "Organization (should you have one)",
                          }}
                        />
                        <br />
                        <br />

                        <FormikField
                          options={{
                            name: "user.email",
                            label: "Email",
                            disabled: true,
                          }}
                        />
                        <br />
                        <br />
                        <br />
                        <br />
                        <img
                          alt="Step Two"
                          src="https://artis.app/images/Artis_two.jpg"
                          width="100px"
                          height="123px"
                        />
                        <p>
                          Along with your name, Proofs of Copyright can display
                          your photo, website, and biography so that people
                          around the world learn more about you. If you want
                          this information displayed, enter it below. 
                          ( you can add or change these later in Settings){" "}
                        </p>
                        <FormikField
                          options={{
                            name: "profile.website",
                            label: "Website",
                          }}
                        />

                        <FormikField
                          options={{
                            name: "profile.photoName",
                            label: "Profile Photo",
                            onClick: () => uploadRef.current.click(),
                          }}
                        />
                        <input
                          id="upload_photo"
                          type="file"
                          accept="image/*"
                          ref={uploadRef}
                          onChange={(e) => handleFileUpload(e, setFieldValue)}
                          hidden
                        />
                        {values.profile.photo && (
                          <Box
                            textAlign="center"
                            sx={{
                              mb: "2%",
                            }}
                          >
                            <img
                              src={URL.createObjectURL(values.profile.photo)}
                              style={{ maxHeight: "200px", maxWidth: "200px" }}
                              alt="ProfileImage"
                            />
                          </Box>
                        )}
                        <FormikField
                          options={{
                            name: "profile.bio",
                            label: "Bio ( you can write paragraphs here)",
                            multiline: true,
                          }}
                        />
                        <br />
                        <br />
                        <br />
                        <br />
                        <img
                          alt="Step Two"
                          src="https://artis.app/images/Artis_three.jpg"
                          width="100px"
                          height="123px"
                        />
                        <p>
                          By default, Artis.app refers to you as an Artist. 
                          If you want to change the name of your creative profession
                          from Artist to anything else -- like Writer, Designer, Photographer, etc -- change it below.
                          ( you can alter this later too ){" "}
                        </p>
                        <FormikField
                          options={{
                            name: "user.artist_type",
                          }}
                        />

                        <br />
                        <br />
                        <br />
                        <br />
                        <img
                          alt="Step Three"
                          src="https://artis.app/images/Artis_four.jpg"
                          width="100px"
                          height="123px"
                        />

                        <p>Press the magic button... </p>
                        <ArtisButton
                          disabled={!(isValid && dirty)}
                          onClick={handleSubmit}
                          name="Create my Free Account"
                          size="medium"
                          id="sign_up"
                          sx={{
                            fontSize: "1.5rem",
                          }}
                          startIcon={isLoading && <CircularProgress />}
                        />
                        <br />
                        {errorData && (
                          <Typography
                            component="h6"
                            gutterBottom
                            align="center"
                            color="red"
                          >
                            {errorData.message}
                          </Typography>
                        )}

                        <br />
                        <br />
                      </Box>
                    </Form>
                  );
                }}
              </Formik>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
