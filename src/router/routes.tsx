import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Layout } from "../components/Layout";
import Inicio from "../pages/Inicio";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useSessionStorage } from "../utils/hook/useSessionStorage";
import Dashboard from "../pages/dashboard";
import { CreateProducts } from "../pages/dashboard/products";
import { CreateProvider } from "../pages/dashboard/providers";

export const ProtectedRoute = () => {
  const { storage } = useSessionStorage("user", null);
  if (!storage) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
};

export const PrivateRoute = () => {
  const { storage } = useSessionStorage("user", null);
  if (storage) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
};

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Inicio />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          { path: "Registro", element: <Register /> },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              {
                path: "products/create",
                element: <CreateProducts />,
              },
              {
                path: "providers/create",
                element: <CreateProvider />,
              },
              {
                path: "users/create",
                element: <Register />,
              },
            ],
          },
        ],
      },

      {
        path: "*",
        element: <h1>404 not found</h1>,
      },
    ],
  },
  {
    path: "*",
    element: <h1>404 not found</h1>,
  },
]);
