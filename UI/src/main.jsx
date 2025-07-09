import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./pages/Profile/profile.jsx";
import Register from "./pages/Register/register.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/profile", element: <Profile/> },
  { path: "/register", element: <Register /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
