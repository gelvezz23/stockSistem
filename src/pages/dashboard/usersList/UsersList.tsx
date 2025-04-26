/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./styles.css";
import Modal from "../../../components/Modal";
import { FormsClient } from "./form";
import useUpdateUserStatus from "../../../utils/hook/useUpdateStatus";

export const UsersList = () => {
  const [users, setUsers] = useState<any>([]);
  const [errorState, setError] = useState<any>(null);
  const [openModalId, setOpenModalId] = useState<number | null>(null); // Estado para el ID del modal abierto

  const { updateUserStatus } = useUpdateUserStatus();

  const handleUpdateStatus = async (userId: number, estado: string) => {
    await updateUserStatus({ usuario_id: userId, estado });
    window.location.reload();
  };

  const openModal = (userId: number) => {
    setOpenModalId(userId); // Establecer el ID del usuario cuyo modal debe abrirse
  };

  const closeModal = () => {
    setOpenModalId(null); // Cerrar cualquier modal abierto
  };

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/usuarios`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) setError("Usuarios no encontrados");

      const data = await response.json();
      setUsers(data);
    };
    getUsers();
  }, []);

  return (
    <section className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Lista de usuarios
        </h1>
        {errorState && <p className="text-red-500 mb-4">{errorState}</p>}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.map(
            (user: {
              usuario_id: number;
              email: string;
              name_rol: string;
              estado: string;
            }) => {
              const isThisModalOpen = openModalId === user.usuario_id;

              return (
                <div
                  key={user.usuario_id}
                  className="bg-white rounded-md shadow-md overflow-hidden"
                >
                  <Modal isOpen={isThisModalOpen} onClose={closeModal}>
                    <section className="h-[78vh] overflow-auto p-4">
                      <FormsClient user={user} />
                    </section>
                  </Modal>
                  <div className="p-4">
                    <h5 className="text-lg font-semibold text-gray-700 mb-2">
                      {user.email}
                    </h5>
                    <p className="text-sm text-gray-500 mb-1">
                      ID: {user.usuario_id}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <p className="mr-2">Rol: {user.name_rol}</p>
                      <p>
                        Estado:{" "}
                        <span
                          className={
                            user.estado === "activo"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {user.estado}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-end mt-2">
                      <div
                        onClick={() => openModal(user.usuario_id)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          width="20"
                          height="20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 15l8.385 -8.415a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3z"></path>
                          <path d="M16 5l3 3"></path>
                          <path d="M9 7.07a7 7 0 0 0 1 13.93a7 7 0 0 0 6.929 -6"></path>
                        </svg>
                      </div>
                      <div
                        onClick={() => {
                          handleUpdateStatus(
                            user.usuario_id,
                            user.estado === "activo" ? "desactivado" : "activo"
                          );
                        }}
                        className="cursor-pointer"
                      >
                        {user.estado === "activo" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="20"
                            height="20"
                            className="text-green-500 hover:text-green-700"
                          >
                            <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7"></path>
                            <path d="M11.089 7.083a5 5 0 0 1 5.826 5.84m-1.378 2.611a5.012 5.012 0 0 1 -.537 .466a3.5 3.5 0 0 0 -1 3a2 2 0 1 1 -4 0a3.5 3.5 0 0 0 -1 -3a5 5 0 0 1 -.528 -7.544"></path>
                            <path d="M9.7 17h4.6"></path>
                            <path d="M3 3l18 18"></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="20"
                            height="20"
                            className="text-red-500 hover:text-red-700"
                          >
                            <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7"></path>
                            <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3"></path>
                            <path d="M9.7 17l4.6 0"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};
