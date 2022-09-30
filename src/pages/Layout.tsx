import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button, Typography, Stack, Box, AppBar, Toolbar } from "@mui/material";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, authStatus } = useAuthenticator((context) => [context.signOut, context.authStatus]);

  const isLoginPage = location.pathname.startsWith("/login");

  const logout = () => {
    signOut();
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
            }}
          >
            Bleam
          </Typography>

          {authStatus === "authenticated" ? (
            <Stack
              sx={{
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Button variant="contained" onClick={() => navigate("/myGames")}>
                My Games
              </Button>

              <Button
                onClick={logout}
                sx={{
                  color: "white",
                }}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            !isLoginPage && (
              <Button variant="contained" onClick={() => navigate("/login")}>
                Log In
              </Button>
            )
          )}
        </Toolbar>
      </AppBar>

      <Toolbar />
      <Outlet />
    </Box>
  );
}
