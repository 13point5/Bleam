import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import {
  AmplifyProvider,
  Authenticator,
  ThemeProvider as AmplifyThemeProvider,
  defaultDarkModeOverride,
} from "@aws-amplify/ui-react";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import GamePage from "./pages/Game";
import { RequireAuth } from "./RequireAuth";

// eslint-disable-next-line import/no-unresolved
import "@aws-amplify/ui-react/styles.css";
import "./index.css";

import config from "./aws-exports";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import UserGames from "./pages/UserGames";
import GameBuilder from "./pages/GameBuilder";

Amplify.configure(config);

const darkTheme = createTheme({
  typography: {
    fontFamily: [
      "Press Start 2P",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    fontSize: 14,
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#6842FE",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AmplifyThemeProvider
        colorMode="dark"
        theme={{
          name: "dark",
          overrides: [defaultDarkModeOverride],
        }}
      >
        <AmplifyProvider>
          <Authenticator.Provider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/myGames"
                    element={
                      <RequireAuth>
                        <UserGames />
                      </RequireAuth>
                    }
                  />
                  <Route path="/game/:id" element={<GamePage />} />
                  <Route
                    path="/game/:id/edit"
                    element={
                      <RequireAuth>
                        <GameBuilder />
                      </RequireAuth>
                    }
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </Authenticator.Provider>
        </AmplifyProvider>
      </AmplifyThemeProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
