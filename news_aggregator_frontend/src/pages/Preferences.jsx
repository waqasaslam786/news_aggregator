import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReloadIcon, Cross2Icon } from "@radix-ui/react-icons";
import queryNames from "@/data/constants/queryNames";
import { get, post } from "@/server";
import { USER_PREFERENCES, ALL_PREFERENCES } from "@/data/constants/apiRoutes";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import validator from "@/utils/helpers/validator";
import { useNavigate } from "react-router-dom";
import {
  FirstStepSchema,
  SecondStepSchema,
  ThirdStepSchema,
} from "@/utils/schemas/PreferencesSchema";
import ErrorMessage from "@/components/ui/errorMessage";
import routes from "@/data/constants/routes";
import { useAtom } from "jotai";
import { loggedUserAtom } from "@/data/store";

const schemas = [FirstStepSchema, SecondStepSchema, ThirdStepSchema];

const initialData = {
  authors: [],
  categories: [],
  sources: [],
};

const Preferences = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [allPrefrences, setAllPrefrences] = useState(initialData);
  const [sources, setSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [errors, setErrors] = useState({});

  const [loggedUser, setLoggedUser] = useAtom(loggedUserAtom);

  const navigate = useNavigate();

  // handle Validation
  const validateForm = () => {
    let newErrors = validator(
      currentStep === 0
        ? { sources: sources }
        : currentStep === 1
        ? { categories: categories }
        : { authors: authors },
      schemas[currentStep]
    );
    setErrors(newErrors);

    if (Object.keys(newErrors).length) return false;

    return true;
  };

  const nextStepClick = () => {
    if (!validateForm()) return;
    setCurrentStep(currentStep + 1);
  };
  const prevStepClick = () => setCurrentStep(currentStep - 1);

  const handleFormRequest = async () => {
    let payload = {
      sources: sources.map((item) => item.id),
      categories: categories.map((item) => item.id),
      authors: authors.map((item) => item.id),
    };

    const { status, message, data } = await post(USER_PREFERENCES, payload);

    if (status) {
      setLoggedUser({
        ...loggedUser,
        preferences: { sources, categories, authors },
      });

      toast(message);
      navigate(routes.HOME);
    } else {
      toast(message);
    }
  };

  const mutation = useMutation(handleFormRequest);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate();
  };

  const fetchData = async () => {
    const { status, message, data } = await get(ALL_PREFERENCES);

    if (status) {
      setAllPrefrences(data);
    } else {
      toast(message);
    }
  };

  const { isLoading, data, isFetching } = useQuery(
    [queryNames.PREFERENCES],
    fetchData,
    { keepPreviousData: true }
  );

  return (
    <div className="flex flex-col justify-center items-center w-[550px] h-full m-auto space-y-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Select your preferences
      </h1>

      <PreferenceStep
        stepNo={0}
        currentStep={currentStep}
        title="Choose your sources"
        description="Select news sources you would like to follow"
        nextClick={nextStepClick}
        prevClick={prevStepClick}
        options={allPrefrences.sources}
        state={sources}
        setState={setSources}
        error={errors.sources}
        loading={mutation.isLoading}
      />

      <PreferenceStep
        stepNo={1}
        currentStep={currentStep}
        title="Choose your categories"
        description="Select news categories you would like to follow"
        nextClick={nextStepClick}
        prevClick={prevStepClick}
        options={allPrefrences.categories}
        state={categories}
        setState={setCategories}
        error={errors.categories}
        loading={mutation.isLoading}
      />

      <PreferenceStep
        stepNo={2}
        currentStep={currentStep}
        title="Choose your authors"
        description="Select news authors you would like to follow"
        nextClick={handleSubmit}
        prevClick={prevStepClick}
        options={allPrefrences.authors}
        state={authors}
        setState={setAuthors}
        error={errors.authors}
        loading={mutation.isLoading}
      />
    </div>
  );
};

const PreferenceStep = ({
  stepNo,
  currentStep,
  title,
  description,
  state,
  setState,
  options,
  nextClick,
  prevClick,
  error,
  loading,
}) => {
  const newOptions = useMemo(() => {
    return options?.filter(
      (option) => !state?.find((single) => single?.id === option?.id)
    );
  }, [state, options]);

  const handleRemoveBadge = (index) => {
    const newStates = [...state];
    newStates.splice(index, 1);
    setState(newStates);
  };

  return (
    <>
      {stepNo === currentStep ? (
        <Card className="w-[350px] h-fit">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent>
            <form>
              <Select
                onValueChange={(value) => {
                  const newState = [...state];
                  const found = options?.find((single) => single?.id == value);
                  newState.push(found);
                  setState(newState);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {/* {options ? (
                    <SelectItem value={options.value}>
                      {options.title}
                    </SelectItem>
                  ) : null} */}

                  {newOptions?.map((item) => {
                    return (
                      <SelectItem value={item.id} key={item.id}>
                        {item.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <ErrorMessage error={error} />
              <div className="flex space-x-1.5 flex-wrap">
                {state?.map((item, index) => {
                  return (
                    <Badge
                      key={item.id}
                      onClick={() => handleRemoveBadge(index)}
                      className="mt-3 cursor-pointer"
                    >
                      {item.name}
                      <Cross2Icon />
                    </Badge>
                  );
                })}
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              disabled={currentStep === 0 || loading}
              onClick={prevClick}
            >
              Prev
            </Button>

            <Button disabled={loading} onClick={nextClick}>
              {currentStep === 2 ? (
                <>
                  {loading ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Submit
                </>
              ) : (
                "Next"
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </>
  );
};

export default Preferences;
