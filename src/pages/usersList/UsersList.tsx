/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./styles.css";
import Modal from "../../components/Modal";
import { FormsClient } from "./form";
import useUpdateUserStatus from "../../utils/hook/useUpdateStatus";

export const UsersList = () => {
  const [users, setUsers] = useState<any>([]);
  const [errorState, setError] = useState<any>(null);
  const [openModalId, setOpenModalId] = useState<number | null>(null); // Estado para el ID del modal abierto

  const { updateUserStatus } = useUpdateUserStatus();

  const handleUpdateStatus = async (userId: number, estado: string) => {
    await updateUserStatus({ usuario_id: userId, estado });
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
    <section>
      <h1>Lista de usuarios</h1>
      {errorState && <p>{errorState}</p>}
      {users.map(
        (user: {
          usuario_id: number;
          email: string;
          name_rol: string;
          estado: string;
        }) => {
          const isThisModalOpen = openModalId === user.usuario_id; // Verificar si este modal debe estar abierto

          return (
            <div className="users" key={user.usuario_id}>
              {" "}
              {/* Agregar una key única al div */}
              <Modal isOpen={isThisModalOpen} onClose={closeModal}>
                <FormsClient user={user} />
              </Modal>
              <div>
                <h5>id: {user.usuario_id}</h5>
                <p>{user.email}</p>
              </div>
              <div>
                <p>rol: {user.name_rol}</p>
                <p>estado: {user.estado}</p>
              </div>
              <div className="users-options">
                <div onClick={() => openModal(user.usuario_id)}>
                  {" "}
                  {/* Pasar el ID del usuario al abrir el modal */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    width="24"
                    height="24"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    stroke="currentColor"
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
                      user.estado === "activo" ? "desactivo" : "activo"
                    );
                  }}
                >
                  {user.estado === "activo" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="24"
                      height="24"
                      strokeWidth="2"
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="24"
                      height="24"
                      strokeWidth="2"
                    >
                      <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7"></path>
                      <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3"></path>
                      <path d="M9.7 17l4.6 0"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        }
      )}
    </section>
  );
};
