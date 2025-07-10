import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../../../api/authApi";

const baseAPI = "http://localhost:8080/api/users";

function Login() {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const hasAlerted = useRef(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const err = searchParams.get("error");
    const logout = searchParams.get("logout");

    if (!hasAlerted.current) {
      if (err) {
        console.log(decodeURIComponent(err));
        hasAlerted.current = true;
      } else if (logout) {
        console.log("Đã đăng xuất thành công");
        hasAlerted.current = true;
      }

      if (err || logout) {
        navigate(window.location.pathname, { replace: true });
      }
    }
  }, [searchParams, navigate]);

  function handleFieldChange({ target: { type, value } }) {
    setFields((prev) => ({
      ...prev,
      [type]: value,
    }));
  }

  function loginButtonHandler() {
    setError(null);
    login(fields)
      .then(({ token }) => {
        console.log(token);
        localStorage.setItem("accessToken", token);
        window.location.replace("/Profile");
      })
      .catch(async (err) => {
        setError(err.message);
        setFields((prev) => ({
          ...prev,
          password: "",
        }));
      });
  }

  function loginEnterHandler(event) {
    if (event.key === "Enter") {
      loginButtonHandler();
    }
  }

  function registerButtonHandler() {
    window.location.replace("/register");
  }

  function loginWithGoogleButtonHandler() {
    window.location.href = `${baseAPI}/auth/google`;
  }

  return (
    <div className="p-5">
      <div className="flex flex-col gap-3 bg-orange-100 w-fit m-auto p-5 rounded-xl">
        <h1 className="text-center font-bold text-2xl mb-2">
          Đăng nhập / Đăng ký
        </h1>
        <label className="flex items-center">
          <p className="w-[100px] text-lg">Email</p>
          <input
            type="email"
            placeholder="Email"
            className="border-1 w-3xs p-2 rounded-sm"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </label>
        <label className="flex items-center">
          <p className="w-[100px] text-lg">Password</p>
          <input
            type="password"
            placeholder="Password"
            className="border-1 w-3xs p-2 rounded-sm"
            value={fields.password}
            onChange={handleFieldChange}
            onKeyUp={loginEnterHandler}
          />
        </label>
        {error ? <p className="text-red-500 text-sm">{error}</p> : <></>}
        <div className="grid grid-cols-2 gap-2">
          <button
            className="bg-orange-300 mt-2 px-4 py-2 cursor-pointer rounded-lg text-lg font-semibold hover:bg-orange-400 hover:text-white"
            onClick={loginButtonHandler}
          >
            Đăng nhập
          </button>
          <button
            className="bg-orange-300 mt-2 px-4 py-2 cursor-pointer rounded-lg text-lg font-semibold hover:bg-orange-400 hover:text-white"
            onClick={registerButtonHandler}
          >
            Đăng ký
          </button>
        </div>
        <button
          className="bg-orange-300 px-4 py-2 cursor-pointer rounded-lg text-lg font-semibold hover:bg-orange-400 hover:text-white"
          onClick={loginWithGoogleButtonHandler}
        >
          Đăng nhập với Google
        </button>
      </div>
    </div>
  );
}

export default Login;
