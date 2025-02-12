import React, { useEffect } from "react";
import { PageBasicProps } from "../../AppMain";
import Layout from "../../Components/Layout";
import Input from "../../Components/TextField/Input";
import { Button } from "@chakra-ui/react";
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

interface SubmitUserForm {
  email: string;
  password: string;
  passwordRepeat: string;
  nickname: string;
}

export const Login: React.FC<PageBasicProps> = ({ themeMode, type }) => {
  const user = useSelector((state: RootState) => state.user.isLoggedIn);
  const { token } = useParams<{ token: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [creatingAccount, setCreatingAccount] = React.useState<boolean>(false);
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

  const sendUserData = async (data: Partial<SubmitUserForm>) => {
    const { email, nickname, password, passwordRepeat } = data;
    if (creatingAccount && password !== passwordRepeat) {
      alert("Hasła nie są takie same");
    } else if (creatingAccount && password === passwordRepeat) {
      try {
        await registerRequest(`${password}`, `${email}`, `${nickname}`);
      } finally {
        navigate("/login", { replace: true });
      }
    } else if (nickname && password) {
      try {
        await loginRequest(password, nickname);
        const user = await checkIfLoggedIn();
        dispatch(setUserLoggedIn(user));
      } finally {
        location.state ? navigate(location.state) : navigate("/");
        reset();
      }
    }
  };

  const { wrappedSubmit } = usePromiseBasedToast({
    handleSubmit,
    onSubmit: sendUserData,
    toastMessages: {
      success: { title: "Login successful", description: "Welcome back!" },
      error: {
        title: "Zalogowanie nie powiodło się",
        description: "Nieprawidłowe dane logowania!",
      },
      loading: { title: "Logging in", description: "Please wait" },
    },
  });

  const { showPromiseToast } = usePromiseToast({});

  const verifyEmailWithNotification = (token: string) => {
    showPromiseToast(async () => await verifyEmailRequest(token), {
      success: {
        title: "Email verified",
        description: "You can now log in",
      },
      error: {
        title: "Email verification failed",
        description: "Invalid token",
      },
      loading: { title: "Verifying email", description: "Please wait" },
    });
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    } else if (token) {
      verifyEmailWithNotification(token);
      navigate("/login", { replace: true });
    }
  }, []);

  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = React.useState(false);

  return (
    <Layout type={type} themeMode={themeMode}>
      <form onSubmit={wrappedSubmit}>
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

                <ActionButton type="submit" >Załóż konto</ActionButton>
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
                    {/* Forgot Password Link */}
                    <Button
                      variant='link'
                      colorScheme={themeMode ? 'blackAlpha' : 'whiteAlpha'}
                      className='mt-3 text-sm text-center'
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
                  <ActionButton type="submit">Zaloguj się</ActionButton>
                </div>
                <div className="flex flex-col">
                  <p
                    className={` mt-3 mb-3 text-center ${themeMode ? "text-black" : "text-white"
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
