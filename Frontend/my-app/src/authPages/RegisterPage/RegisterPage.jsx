import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import AuthBox from "../../shared/components/AuthBox";
import RegisterPageInputs from "./RegisterPageInputs";
import RegisterPageFooter from "./RegisterPageFooter";
import { validateRegisterForm } from "../../shared/utils/validators";
import { connect } from "react-redux";
import { getActions } from "../../store/actions/authActions";
import { useNavigate } from "react-router-dom";
import SyncMeetLogo from "../../shared/components/SyncMeetLogo";

const RegisterPage = ({ register }) => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    const userDetails = {
      email,
      username,
      password,
    };

    register(userDetails, navigate);
  };

  useEffect(() => {
    setIsFormValid(
      validateRegisterForm({
        email,
        username,
        password,
      })
    );
  }, [email, username, password]);

  return (
    <AuthBox>
      <Typography variant="h5">
        Create an account
      </Typography>

      <Box sx={{ alignSelf: "flex-start", mb: 3 }}>
        <SyncMeetLogo size={48} textVariant="short" />
      </Box>
      <Typography variant="h5" sx={{ color: "white", fontWeight: 600, alignSelf: "flex-start", mb: 1 }}>
        Create Account
      </Typography>
      <form onSubmit={handleRegister} style={{ width: "100%" }}>

        <RegisterPageInputs
          email={email}
          setEmail={setEmail}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />

        <RegisterPageFooter
          handleRegister={handleRegister}
          isFormValid={isFormValid}
        />
      </form>
    </AuthBox>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getActions(dispatch),
  };
};

export default connect(null, mapActionsToProps)(RegisterPage);