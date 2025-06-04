/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

function ProductList() {
  // Estado para almacenar la lista de productos
  // Cada producto es un objeto { id, name, quantity }
  const [products, setProducts] = useState<any>([]);

  // Estado para el nombre del nuevo producto a agregar
  const [newProductName, setNewProductName] = useState("");

  // Estado para la cantidad del nuevo producto
  const [newProductQuantity, setNewProductQuantity] = useState(1); // Valor inicial de 1

  // Función para manejar el envío del formulario de agregar producto
  const handleAddProduct = (e: any) => {
    e.preventDefault(); // Evita que la página se recargue

    // Validar que el nombre del producto no esté vacío
    if (newProductName.trim() === "") {
      alert("El nombre del producto no puede estar vacío.");
      return;
    }

    // Validar que la cantidad sea un número positivo
    if (newProductQuantity <= 0) {
      alert("La cantidad debe ser un número positivo.");
      return;
    }

    // Generar un ID único para el nuevo producto (simple, para este ejemplo)
    const newId =
      products.length > 0 ? Math.max(...products.map((p: any) => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      name: newProductName.trim(),
      quantity: Number(newProductQuantity), // Asegurarse de que sea un número
    };

    // Añadir el nuevo producto a la lista existente
    setProducts((prevProducts: any) => [...prevProducts, newProduct]);

    // Limpiar los campos del formulario
    setNewProductName("");
    setNewProductQuantity(1); // Restablecer la cantidad a 1
  };

  // Función para eliminar un producto de la lista
  const handleDeleteProduct = (id: any) => {
    setProducts((prevProducts: any) =>
      prevProducts.filter((product: any) => product.id !== id)
    );
  };

  // Función para incrementar/decrementar la cantidad de un producto existente
  const handleQuantityChange = (id: any, delta: any) => {
    setProducts((prevProducts: any) =>
      prevProducts.map((product: any) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + delta) } // Asegura que la cantidad mínima sea 1
          : product
      )
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-lg bg-gray-50 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Lista de Compras
      </h2>

      {/* Formulario para agregar nuevos productos */}
      <form
        onSubmit={handleAddProduct}
        className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Agregar Nuevo Producto
        </h3>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={newProductQuantity}
            onChange={(e) => setNewProductQuantity(Number(e.target.value))}
            min="1"
            className="w-24 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
          >
            Añadir
          </button>
        </div>
      </form>

      {/* Lista de productos actuales */}
      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-8">
          No hay productos en la lista. ¡Añade algunos!
        </p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {products.map((product: any) => (
              <li
                key={product.id}
                className="flex items-center justify-between p-4 sm:p-5"
              >
                <div className="flex-grow">
                  <p className="text-lg font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Cantidad: {product.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold text-gray-800 w-8 text-center">
                    {product.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(product.id, 1)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200"
                    aria-label="Eliminar producto"
                  >
                    {/* Icono de X o basura (puedes usar un SVG o un icono de librería) */}
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-1 4a1 1 0 00-1 1h4a1 1 0 100-2H8a1 1 0 00-1 1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductList;
