import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/images/logo.png";
import { useAtom } from "jotai";
import { loggedUserAtom } from "@/data/store";
import routes from "@/data/constants/routes";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const [loggedUser, setLoggedUser] = useAtom(loggedUserAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedUser({});
    navigate(routes.LOGIN);
    toast("Logged out successfully");
  };

  return (
    <div className="border-b flex h-16 items-center justify-between px-4">
      <img src={logo} alt="logo" className="w-[70px]" />

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>
              {`${loggedUser.firstName.charAt(0)}${loggedUser.lastName.charAt(
                0
              )}`}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
