import React from "react";
import ReactDOM from "react-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createGlobalStyle } from "styled-components";

import SchedulePage from "./pages/SchedulePage";
import store from "./store";
import SignUpInForm from "components/Organisms/SignUpInForm";
import Snack from "components/Molecules/Snack";
import DashboardPage from "pages/DashboardPage";
import { Scheduler } from "libs/scheduler-view/lib/Scheduler";
import ProtectedRoute from "ProtectedRoute";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
  p {
    margin: 0;
    font-family: sans-serif;
  }
`;

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Snack>
          <Router>
            <GlobalStyle />
            <Switch>
              <ProtectedRoute path="/" component={DashboardPage} exact />

              <Route
                path="/sign-up"
                component={({ history }) => (
                  <SignUpInForm signUpForm history={history} />
                )}
                exact
              />
              <Route
                path="/sign-in"
                component={({ history }) => <SignUpInForm history={history} />}
                exact
              />
              <ProtectedRoute
                path="/calendar/:id"
                component={SchedulePage}
                exact
              />
              <ProtectedRoute
                path="/calendars"
                component={() => <Scheduler combined />}
                exact
              />
            </Switch>
          </Router>
        </Snack>
      </ThemeProvider>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
