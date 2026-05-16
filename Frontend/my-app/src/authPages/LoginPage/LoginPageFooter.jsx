import React from "react";
import CustomPrimaryButton from "../../shared/components/CustomPrimaryButton";
import RedirectInfo from "../../shared/components/RedirectInfo";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

const LoginPageFooter = ({ handleLogin, isFormValid }) => {

  const navigate = useNavigate();

  const handlePushToRegisterPage = () => {
    navigate("/register");
  };

  return (
    <>

      <Tooltip
        title={!isFormValid ? "Enter valid email and password" : "Press to login"}
        arrow
      >
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <CustomPrimaryButton
            label="Login"
            disabled={!isFormValid}
            type="submit"
            additionalStyles={{ marginTop: "30px" }}
          />
        </div>
      </Tooltip>

      <RedirectInfo
        text="Need an account?"
        redirectText="Create account"
        redirectHandler={handlePushToRegisterPage}
        additionalStyles={{ marginTop: "10px" }}
      />

    </>
  );
};

export default LoginPageFooter;