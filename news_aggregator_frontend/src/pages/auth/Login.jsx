import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/images/logo.png";
import ErrorMessage from "@/components/ui/errorMessage";
import { LoginSchema } from "@/utils/schemas/AuthSchema";
import { useAtom } from "jotai";
import { loggedUserAtom } from "@/data/store";

import { Link, useNavigate } from "react-router-dom";
import { post } from "@/server";
import { useMutation } from "react-query";
import routes from "@/data/constants/routes";
import { USER_LOGIN } from "@/data/constants/apiRoutes";
import validator from "@/utils/helpers/validator";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

const initialData = {
  email: "",
  password: "",
};

const Login = () => {
  const [auth, setAuth] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loggedUser, setLoggedUser] = useAtom(loggedUserAtom);

  const navigate = useNavigate();

  // handle Validation
  const validateForm = () => {
    let newErrors = validator(auth, LoginSchema);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return false;
    return true;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAuth({ ...auth, [name]: value });
  };

  const handleLogin = async () => {
    const { status, message, data } = await post(USER_LOGIN, auth);
    if (status) {
      setLoggedUser(data);
      toast(message);
      if (
        data?.preferences?.authors?.length > 0 ||
        data?.preferences?.categories?.length > 0 ||
        data?.preferences?.sources?.length > 0
      ) {
        navigate(routes.HOME);
      } else {
        navigate(routes.PREFERENCES);
      }
    } else {
      toast(message);
    }
  };

  const mutation = useMutation(handleLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate();
  };

  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center">
      <img src={logo} alt="logo" className="w-[125px]" />

      <Card className="w-[350px] h-fit">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to login</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter email"
                  name="email"
                  value={auth.email}
                  onChange={handleChange}
                />
                <ErrorMessage error={errors?.email} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter password"
                  type="password"
                  name="password"
                  value={auth.password}
                  onChange={handleChange}
                />
                <ErrorMessage error={errors?.password} />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to={routes.SIGN_UP}>Sign Up</Link>
            </Button>
            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};

export default Login;
