/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { ProductDetails } from "../../components/productDetails";
import { useCartStore } from "../../utils/zustand/store/useCartStore";

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

  const addProduct = useCartStore((state) => state.addProduct);
  const [add, setAdd] = useState("");

  const handleAddProduct = (product: any) => {
    addProduct({ ...product, quantity: 1 });
    setAdd("Producto fue agregado");
    setTimeout(() => {
      setAdd("");
    }, 1000);
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
        {add && (
          <p className="text-green-500 hover:text-green-700 mr-2">{add}</p>
        )}
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Lista de productos
        </h1>
        {errorState && <p className="text-red-500 mb-4">{errorState}</p>}
        <ul className="space-y-4">
          {products.map((user: any) => {
            const isThisModalOpen = openModalId === user.producto_id;

            return (
              <li
                key={user.producto_id}
                className="bg-white rounded-md shadow-md overflow-hidden flex items-center"
              >
                <Modal isOpen={isThisModalOpen} onClose={closeModal}>
                  <section className="h-[78vh] overflow-auto p-4">
                    <ProductDetails product={user} />
                  </section>
                </Modal>
                <img
                  src={user.image_url}
                  alt={user.nombre_producto}
                  className="w-32 h-32 object-cover mr-4"
                />
                <div className="p-4 flex-grow">
                  <h5 className="text-lg font-semibold text-gray-700 mb-1">
                    {user.nombre_producto}
                  </h5>
                  <p className="text-sm text-gray-500 mb-1">
                    ID: {user.producto_id}
                  </p>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <p className="mr-2">Stock: {user.stock}</p>
                    <p>
                      Estado:{" "}
                      <span
                        className={
                          user.estado === "disponible"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {user.estado}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="p-4 flex items-center">
                  <div
                    onClick={() => {
                      handleAddProduct(user);
                    }}
                    className="cursor-pointer text-green-500 hover:text-green-700 mr-4"
                  >
                    agregar
                  </div>
                  <div
                    onClick={() => openModal(user.producto_id)}
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                  >
                    ver detalle
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
