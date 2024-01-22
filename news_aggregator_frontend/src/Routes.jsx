import { Route } from "react-router-dom";
import routes from "@/data/constants/routes";
import CheckAlreadyLoggedIn from "@/components/auth/CheckAlreadyLoggedIn";
import CheckAuth from "@/components/auth/CheckAuth";
import Layout from "@/components/layout/Layout";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Preferences from "@/pages/Preferences";
import Homepage from "@/pages/Homepage";

const Routes = (
  <>
    <Route element={<CheckAlreadyLoggedIn />}>
      <Route path={routes.LOGIN} element={<Login />} />
      <Route path={routes.SIGN_UP} element={<Signup />} />
    </Route>

    <Route element={<CheckAuth />}>
      <Route element={<Layout />}>
        <Route path={routes.PREFERENCES} element={<Preferences />} />
        <Route path={routes.HOME} element={<Homepage />} />
      </Route>
    </Route>
  </>
);

export default Routes;
