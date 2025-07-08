import { useState, useEffect } from "react";
import { getUserProfile, logout } from "../../../api/authApi";

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getUser() {
    setIsLoading(true);
    setError(null);
    try {
      const user = await getUserProfile();
      setUser(user.user);
    } catch (err) {
      setError(err.message);
      // setTimeout(() => {
      //   handleLogoutAndRedirect();
      // }, 2000);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);

      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    if (!localStorage.getItem("accessToken")) {
      handleLogoutAndRedirect();
      return;
    }
    getUser();
  }, []);

  function handleLogoutAndRedirect() {
    localStorage.removeItem("accessToken");
    window.location.replace("/");
  }

  function handleButtonLogout() {
    logout().catch((err) => console.error(err.message));
  }

  return (
    <div className="p-5">
      {error ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-lg text-red-500 font-bold">
            Có lỗi xảy ra: {error}
          </p>
        </div>
      ) : isLoading ? (
        <p className="text-lg text-orange-700 text-center">Đang tải...</p>
      ) : (
        <div className="w-fit m-auto bg-orange-100 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-5 text-lg">
              <p className="w-[200px]">Họ: </p>
              <p>{user.last_name}</p>
            </div>{" "}
            <hr />
            <div className="flex gap-5 text-lg">
              <p className="w-[200px]">Tên: </p>
              <p>{user.first_name}</p>
            </div>{" "}
            <hr />
            <div className="flex gap-5 text-lg">
              <p className="w-[200px]">Email: </p>
              <p>{user.email}</p>
            </div>{" "}
            <hr />
            <div className="flex gap-5 text-lg">
              <p className="w-[200px]">Số điện thoại: </p>
              <p>{user.phone_number}</p>
            </div>
          </div>
          <button
            className="bg-orange-300 px-3 py-1 rounded-lg cursor-pointer"
            onClick={handleButtonLogout}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
