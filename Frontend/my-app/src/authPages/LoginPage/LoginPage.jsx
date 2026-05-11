import React, { useState, useEffect } from "react";
import AuthBox from "../../shared/components/AuthBox";
import LoginPageHeader from "./LoginPageHeader";
import LoginPageInputs from "./LoginPageInputs";
import LoginPageFooter from "./LoginPageFooter";
import { validateLoginForm } from "../../shared/utils/validators";
import { connect } from "react-redux";
import { getActions } from "../../store/actions/authActions";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ login }) => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {

    const valid = validateLoginForm({
      email,
      password
    });

    setIsFormValid(valid);

  }, [email, password]);

  const handleLogin = () => {

    if (!isFormValid) return;

    const userDetails = {
      email,
      password
    };

    login(userDetails, navigate);
  };

  return (
    <AuthBox>

      <LoginPageHeader />

      <LoginPageInputs
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />

      <LoginPageFooter
        handleLogin={handleLogin}
        isFormValid={isFormValid}
      />

    </AuthBox>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getActions(dispatch),
  };
};

export default connect(null, mapActionsToProps)(LoginPage);
