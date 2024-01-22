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
import { SignUpSchema } from "@/utils/schemas/AuthSchema";
import { useAtom } from "jotai";
import { loggedUserAtom } from "@/data/store";
import { Link, useNavigate } from "react-router-dom";
import { post } from "@/server";
import { useMutation } from "react-query";
import routes from "@/data/constants/routes";
import { USER_SIGN_UP } from "@/data/constants/apiRoutes";
import validator from "@/utils/helpers/validator";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

const initialData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const Signup = () => {
  const [auth, setAuth] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loggedUser, setLoggedUser] = useAtom(loggedUserAtom);

  const navigate = useNavigate();

  // handle Validation
  const validateForm = () => {
    let newErrors = validator(auth, SignUpSchema);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return false;
    return true;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAuth({ ...auth, [name]: value });
  };

  const handleSignup = async () => {
    const { status, message, data } = await post(USER_SIGN_UP, auth);
    if (status) {
      setLoggedUser(data);
      toast(message);
      navigate(routes.PREFERENCES);
    } else {
      toast(message);
    }
  };

  const mutation = useMutation(handleSignup);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate();
  };

  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center">
      <img src={logo} alt="logo" className="w-[125px]" />

      <Card className="w-[450px] h-fit">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account by filling the following form
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex space-x-1.5">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    name="firstName"
                    value={auth.firstName}
                    onChange={handleChange}
                  />
                  <ErrorMessage error={errors?.firstName} />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    name="lastName"
                    value={auth.lastName}
                    onChange={handleChange}
                  />
                  <ErrorMessage error={errors?.lastName} />
                </div>
              </div>

              <div className="flex space-x-1.5">
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

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  placeholder="Enter confirm password"
                  type="password"
                  name="confirmPassword"
                  value={auth.confirmPassword}
                  onChange={handleChange}
                />
                <ErrorMessage error={errors?.confirmPassword} />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to={routes.LOGIN}>Login</Link>
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

export default Signup;
