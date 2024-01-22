import { useAtom } from "jotai";
import { loggedUserAtom } from "@/data/store";
import { useNavigate, Outlet } from "react-router-dom";
import routes from "@/data/constants/routes";

const CheckAuth = () => {
  const [loggedUser] = useAtom(loggedUserAtom);

  const navigate = useNavigate();

  if (!loggedUser?.token) {
    navigate(routes.LOGIN);
  } else {
    return <Outlet />;
  }
};

export default CheckAuth;
