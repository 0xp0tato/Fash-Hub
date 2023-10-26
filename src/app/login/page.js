"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { login } from "@/services/login";
import { loginFormControls } from "@/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const initialFormData = {
  email: "",
  password: "",
};

export default function Login() {
  const router = useRouter();

  const [formData, setformData] = useState(initialFormData);

  const {
    isAuthUser,
    setisAuthUser,
    user,
    setuser,
    componentLevelLoader,
    setcomponentLevelLoader,
  } = useContext(GlobalContext);

  function isValidForm() {
    return formData &&
      formData.email &&
      formData.email.trim() !== "" &&
      formData.password &&
      formData.password.trim() !== ""
      ? true
      : false;
  }

  async function handleLogin() {
    setcomponentLevelLoader({ loading: true, id: "" });
    const res = await login(formData);
    if (res.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setisAuthUser(true);
      setuser(res?.finalData?.user);
      setformData(initialFormData);
      Cookies.set("token", res?.finalData?.token);
      localStorage.setItem("user", JSON.stringify(res?.finalData?.user));
      setcomponentLevelLoader({ loading: false, id: "" });
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setisAuthUser(false);
      setcomponentLevelLoader({ loading: false, id: "" });
    }
  }

  console.log(isAuthUser, user);

  useEffect(() => {
    if (isAuthUser) router.push("/");
  }, [isAuthUser]);

  return (
    <div className="bg-white relative">
      <div className="flex flex-col  items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
          <div className="w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="flex flex-col items-center jsutify-start p-10 bg-white shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center font-serif">
                Login
              </p>
              <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                {loginFormControls.map((controlItem) =>
                  controlItem.componentType === "input" ? (
                    <InputComponent
                      type={controlItem.type}
                      placeholder={controlItem.placeholder}
                      label={controlItem.label}
                      value={formData[controlItem.id]}
                      onChange={(event) => {
                        setformData({
                          ...formData,
                          [controlItem.id]: event.target.value,
                        });
                      }}
                    />
                  ) : null
                )}
                <button
                  className="custom-button w-full disabled:opacity-50"
                  disabled={!isValidForm()}
                  onClick={handleLogin}
                >
                  {componentLevelLoader && componentLevelLoader.loading ? (
                    <ComponentLevelLoader
                      text={"Logging in"}
                      loading={
                        componentLevelLoader && componentLevelLoader.loading
                      }
                      color={"#ffffff"}
                    />
                  ) : (
                    "Login"
                  )}
                </button>
                <div className="flex flex-col gap-2">
                  <p>New to Website ?</p>
                  <button
                    className="custom-button w-full"
                    onClick={() => router.push("/register")}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}
