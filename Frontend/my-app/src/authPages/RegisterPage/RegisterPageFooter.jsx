import React from "react";
import CustomPrimaryButton from "../../shared/components/CustomPrimaryButton";
import RedirectInfo from "../../shared/components/RedirectInfo";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

const getFormNotValidMessage = () => {
  return "Username should contain 3-12 characters, password should contain 6-12 characters, and a valid email address must be provided.";
};

const getFormValidMessage = () => {
  return "Press to register!";
};

const RegisterPageFooter = ({ handleRegister, isFormValid }) => {
  const navigate = useNavigate();

  const handlePushToLoginPage = () => {
    navigate("/login");
  };

  return (
    <>
      <Tooltip
        title={isFormValid ? getFormValidMessage() : getFormNotValidMessage()}
        arrow
      >
        {/* Tooltip needs wrapper if button is disabled */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CustomPrimaryButton
            label="Register Now"
            additionalStyles={{ marginTop: "30px" }}
            disabled={!isFormValid}
            type="submit"
          />
        </div>
      </Tooltip>

      <RedirectInfo
        text=""
        redirectText="Already have an account?"
        additionalStyles={{ marginTop: "10px", textAlign: "center" }}
        redirectHandler={handlePushToLoginPage}
      />
    </>
  );
};

export default RegisterPageFooter;