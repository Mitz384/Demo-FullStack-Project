import { useState } from "react";
import { register } from "../../../api/authApi";

function Register() {
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleFieldChange = ({ target: { name, value } }) => {
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    setError(null);
    event.preventDefault();
    register(fields)
      .catch((err) => {
        console.error(err.message);
        setError(err.message);
      });
  };

  return (
    <div className="p-5">
      <div className="bg-orange-100 w-fit m-auto p-5 rounded-lg flex flex-col gap-5">
        <h1 className="font-bold text-2xl text-center">Đăng ký</h1>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <label className="flex gap-2 items-center">
            <span className="text-lg w-[10rem] font-medium">
              Họ
              <span className="ml-1 text-red-500">*</span>
            </span>
            <input
              type="text"
              name="firstName"
              className="border-1 p-2 rounded-sm w-3xs"
              required
              onChange={handleFieldChange}
            />
          </label>
          <label className="flex gap-2 items-center">
            <span className="text-lg w-[10rem] font-medium">
              Tên<span className="ml-1 text-red-500">*</span>
            </span>
            <input
              type="text"
              name="lastName"
              className="border-1 p-2 rounded-sm w-3xs"
              required
              onChange={handleFieldChange}
            />
          </label>
          <label className="flex gap-2 items-center">
            <span className="text-lg w-[10rem] font-medium">
              Email<span className="ml-1 text-red-500">*</span>
            </span>
            <input
              type="email"
              name="email"
              className="border-1 p-2 rounded-sm w-3xs"
              required
              onChange={handleFieldChange}
            />
          </label>
          <label className="flex gap-2 items-center">
            <span className="text-lg w-[10rem] font-medium">
              Số điện thoại<span className="ml-1 text-red-500">*</span>
            </span>
            <input
              type="text"
              name="phoneNumber"
              pattern="^(\+?[0-9 ]{8,20})$"
              className="border-1 p-2 rounded-sm w-3xs"
              required
              onChange={handleFieldChange}
            />
          </label>
          <label className="flex gap-2 items-center">
            <span className="text-lg w-[10rem] font-medium">
              Mật khẩu<span className="ml-1 text-red-500">*</span>
            </span>
            <input
              type="password"
              name="password"
              className="border-1 p-2 rounded-sm w-3xs"
              required
              onChange={handleFieldChange}
            />
          </label>
          {error ? <p className="text-red-500">{error}</p> : <></>}
          <input
            type="submit"
            value="Đăng ký"
            className=" mt-3 bg-orange-300 p-2 text-lg font-semibold rounded-lg cursor-pointer hover:bg-orange-400 hover:text-white"
          />
        </form>
      </div>
    </div>
  );
}

export default Register;
