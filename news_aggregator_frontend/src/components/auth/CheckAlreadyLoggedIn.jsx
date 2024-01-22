import { useAtom } from "jotai";
import { loggedUserAtom } from "@/data/store";
import { useNavigate, Outlet } from "react-router-dom";
import routes from "@/data/constants/routes";

const CheckAlreadyLoggedIn = () => {
  const [loggedUser] = useAtom(loggedUserAtom);

  const navigate = useNavigate();

  if (loggedUser?.token) {
    navigate(routes.HOME);
  } else {
    return <Outlet />;
  }
};

export default CheckAlreadyLoggedIn;
