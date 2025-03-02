import React, { useEffect } from "react";
import { PageBasicProps } from "../../AppMain";
import Layout from "../../Components/Layout";
import Input from "../../Components/TextField/Input";
import { Button, useToast, Spinner } from "@chakra-ui/react";
import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { apiPostReq } from "../../Constant/api-functions";
import {
  checkIfLoggedIn,
  loginRequest,
  registerRequest,
  verifyEmailRequest,
} from "../../Constant/api-requests";
import PromiseBasedToast, {
  usePromiseBasedToast,
  usePromiseToast,
} from "../../Components/Toast/Toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserLoggedIn } from "../../reducers/user";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { ActionButton } from "../../Components/Button";
import { apiBaseUrl } from "../../Constant/config";

interface SubmitUserForm {
  email: string;
  password: string;
  passwordRepeat: string;
  nickname: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  message: string;
  accessToken: string;
}

interface LoginError {
  message: string;
}

async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const apiUrl = `${apiBaseUrl}/auth/login`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Ensure cookies are included
    });

    // Check if the response is not ok
    if (!response.ok) {
      const errorData: LoginError = await response.json();
      throw new Error(errorData.message || "Failed to log in");
    }

    // Parse and return the response as `LoginResponse`
    const data: LoginResponse = await response.json();
    console.log("Login successful:", data.user);
    localStorage.setItem("creds", JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error("Error logging in:", { error });
    throw error;
  }
}

export const Login: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const user = useSelector((state: RootState) => state.user.isLoggedIn);
  const { token } = useParams<{ token: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [creatingAccount, setCreatingAccount] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubmitUserForm>({
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      passwordRepeat: "",
    },
    mode: "all",
  });

  const { showPromiseToast } = usePromiseToast({});

  const sendUserData = async (data: Partial<SubmitUserForm>) => {
    setIsLoading(true);
    const { email, nickname, password, passwordRepeat } = data;
    try {
      if (creatingAccount && password !== passwordRepeat) {
        throw new Error("Passwords do not match");
      }

      if (creatingAccount && password === passwordRepeat) {
        await showPromiseToast(
          () => registerRequest(`${password}`, `${email}`, `${nickname}`),
          {
            loading: { title: "Registering..." },
            success: {
              title: "Registration successful!",
              description: "Please check your email for verification",
            },
            error: { title: "Registration failed" },
          }
        );
        navigate("/login", { replace: true });
      } else if (nickname && password) {
        const loginData = await showPromiseToast(
          () => loginUser(nickname, password),
          {
            loading: { title: "Logging in..." },
            success: { title: "Login successful!" },
            error: { title: "Login failed" },
          }
        );
        if (loginData?.user) {
          dispatch(setUserLoggedIn(loginData.user));
        }
        location.state ? navigate(location.state) : navigate("/");
        reset();
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const verifyEmailWithNotification = async (token: string) => {
  //   await showPromiseToast(verifyEmailRequest(token), {
  //     loading: "Verifying email...",
  //     success: "Email verified successfully",
  //     error: (err) => err.message || "Email verification failed",
  //   });
  // };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] =
    React.useState(false);

  return (
    <Layout type={type} themeMode={themeMode}>
      <form onSubmit={handleSubmit(sendUserData)}>
        <div className="flex w-full justify-center mt-20">
          <div
            className={`${themeMode ? "border border-solid" : "bg-[#242526]"} w-[500px] shadow-lg rounded-2xl px-6 py-4`}
          >
            {creatingAccount ? (
              <div className="flex flex-col justify-between h-full gap-3">
                <Input
                  register={register}
                  label="email"
                  name="email"
                  type={type}
                  error={errors.email?.message}
                />
                <Input
                  register={register}
                  label="ksywa"
                  name="nickname"
                  type={type}
                  error={errors.nickname?.message}
                />
                <Input
                  register={register}
                  label="hasło"
                  name="password"
                  type={type}
                  error={errors.password?.message}
                />
                <Input
                  register={register}
                  label="powtórz hasło"
                  name="passwordRepeat"
                  type={type}
                  error={errors.passwordRepeat?.message}
                />

                <ActionButton type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : "Załóż konto"}
                </ActionButton>
                <p
                  className={`mt-3 text-center ${themeMode ? "text-black" : "text-white"}`}
                >
                  Masz konto?
                </p>
                <Button
                  onClick={() => setCreatingAccount(false)}
                  variant="ghost"
                  colorScheme={themeMode ? "blackAlpha" : "whiteAlpha"}
                >
                  Zaloguj się
                </Button>
              </div>
            ) : (
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-3">
                  <Input
                    register={register}
                    label="email / ksywa"
                    name="nickname"
                    type={type}
                    error={errors.nickname?.message}
                  />
                  <Input
                    register={register}
                    label="hasło"
                    name="password"
                    type={type}
                    error={errors.password?.message}
                  />

                  <div>
                    <Button
                      variant="link"
                      colorScheme={themeMode ? "blackAlpha" : "whiteAlpha"}
                      className="mt-3 text-sm text-center"
                      onClick={() => setForgotPasswordModalOpen(true)}
                    >
                      Zapomniałeś hasła?
                    </Button>
                    <ForgotPasswordModal
                      isOpen={forgotPasswordModalOpen}
                      onClose={() => setForgotPasswordModalOpen(false)}
                      themeMode={themeMode}
                    />
                  </div>
                  <ActionButton type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner size="sm" /> : "Zaloguj się"}
                  </ActionButton>
                </div>
                <div className="flex flex-col">
                  <p
                    className={` mt-3 mb-3 text-center ${
                      themeMode ? "text-black" : "text-white"
                    }`}
                  >
                    lub
                  </p>
                  <Button
                    onClick={() => setCreatingAccount(true)}
                    variant="ghost"
                    colorScheme={themeMode ? "blackAlpha" : "whiteAlpha"}
                  >
                    Załóż konto
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Login;
