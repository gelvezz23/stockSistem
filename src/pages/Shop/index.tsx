/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { ProductDetails } from "../../components/productDetails";

export const Shop = () => {
  const [products, setProducts] = useState<any>([]);
  const [errorState, setError] = useState<any>(null);
  const [openModalId, setOpenModalId] = useState<number | null>(null); // Estado para el ID del modal abierto

  const openModal = (userId: number) => {
    setOpenModalId(userId); // Establecer el ID del usuario cuyo modal debe abrirse
  };

  const closeModal = () => {
    setOpenModalId(null); // Cerrar cualquier modal abierto
  };

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/productos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) setError("Usuarios no encontrados");

      const data = await response.json();
      setProducts(data);
    };
    getProducts();
  }, []);

  return (
    <section className="bg-gray-100 min-h-screen py-8 overflow-scroll">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Lista de productos
        </h1>
        {errorState && <p className="text-red-500 mb-4">{errorState}</p>}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map(
            (user: {
              producto_id: number;
              nombre_producto: string;
              stock: number;
              estado: string;
              image_url: string;
            }) => {
              const isThisModalOpen = openModalId === user.producto_id;

              return (
                <div
                  key={user.producto_id}
                  className="bg-white rounded-md shadow-md overflow-hidden"
                >
                  <Modal isOpen={isThisModalOpen} onClose={closeModal}>
                    <section className="h-[78vh] overflow-auto p-4">
                      <ProductDetails product={user} />
                    </section>
                  </Modal>
                  <img
                    src={user.image_url}
                    alt={user.nombre_producto}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h5 className="text-lg font-semibold text-gray-700 mb-2">
                      {user.nombre_producto}
                    </h5>
                    <p className="text-sm text-gray-500 mb-1">
                      ID: {user.producto_id}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <p className="mr-2">Stock: {user.stock}</p>
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
                        onClick={() => openModal(user.producto_id)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700 mr-2"
                      >
                        ver detalle
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
