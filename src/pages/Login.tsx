import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Box } from "@mui/material";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
export function Login() {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (route === "authenticated") {
      navigate(from, { replace: true });
    }
  }, [route, navigate, from]);

  return (
    <Box sx={{ mt: 4 }}>
      <Authenticator></Authenticator>
    </Box>
  );
}
