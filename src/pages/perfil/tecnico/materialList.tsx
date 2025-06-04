/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

function ProductList({ id }: { id: any }) {
  const [availableProducts, setAvailableProducts] = useState<any>([]);
  const [cartItems, setCartItems] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const body = cartItems.map((i: any) => {
      return { codigo: i.codigo, quantity: i.quantity };
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/citas/update`,
        {
          method: "PUT", // Utilizamos PUT para actualizar un recurso existente
          headers: {
            "Content-Type": "application/json", // Indicamos que el cuerpo de la solicitud es JSON
          },
          body: JSON.stringify({
            producto_id: JSON.stringify(body),
            cliente_id: id,
          }), // Convertimos el objeto JavaScript 'body' a una cadena JSON
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Algo salió mal al actualizar el servicio."
        );
      }

      const data = await response.json();
      console.log("Servicio actualizado con éxito:", data);
      alert("¡Servicio actualizado correctamente!");
      window.location.reload();
    } catch (error: any) {
      console.error("Error al enviar la solicitud:", error);
      alert(`Error al actualizar el servicio: ${error.message}`);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_URL}/api/productos`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Filtrar productos con categoria_id === 1 y añadir una cantidad inicial de 1
        const newData = data
          .filter((i: any) => i.categoria_id === 1)
          .map((prod: any) => ({ ...prod, quantity: 1 })); // Asignar una cantidad inicial para la lista de disponibles
        setAvailableProducts(newData);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Podrías manejar un estado de error aquí si lo necesitas
      }
    };
    getProducts();
  }, []);

  // Función para manejar el envío del formulario de agregar producto (este es para añadir a `availableProducts`, no al carrito)

  // Función para añadir un producto al carrito
  const handleAddToCart = (productToAdd: any) => {
    setCartItems((prevCartItems: any) => {
      const existingItem = prevCartItems.find(
        (item: any) => item.codigo === productToAdd.codigo
      );

      if (existingItem) {
        return prevCartItems.map((item: any) =>
          item.codigo === productToAdd.codigo
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCartItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  // Función para incrementar/decrementar la cantidad de un producto en el CARRITO
  const handleCartQuantityChange = (id: any, delta: any) => {
    setCartItems(
      (prevCartItems: any) =>
        prevCartItems
          .map((item: any) =>
            item.codigo === id
              ? { ...item, quantity: Math.max(0, item.quantity + delta) } // Permitir que la cantidad sea 0 temporalmente
              : item
          )
          .filter((item: any) => item.quantity > 0) // Eliminar si la cantidad final es 0
    );
  };

  // Función para eliminar un producto del CARRITO
  const handleRemoveFromCart = (id: any) => {
    setCartItems((prevCartItems: any) =>
      prevCartItems.filter((item: any) => item.codigo !== id)
    );
  };

  // Función para calcular el total del carrito
  /* const calculateCartTotal = () => {
    return cartItems.reduce(
      (total: number, item: any) =>
        total + item.quantity * (item.precio_venta || 0),
      0
    );
  };*/

  // *** LÓGICA DE FILTRADO DE PRODUCTOS DISPONIBLES ***
  const filteredProducts = availableProducts.filter((product: any) =>
    // Convierte el código del producto a string y lo compara con el término de búsqueda
    // usando toLowerCase() para una búsqueda sin distinción entre mayúsculas y minúsculas
    product.codigo.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8 text-black">
      {/* Sección de Lista de Productos Disponibles */}
      <div className="flex-1 bg-gray-50 rounded-lg shadow-xl border border-gray-200 p-4">
        <h5 className="text-xl font-extrabold text-gray-800 text-center mb-6">
          Materiales Disponibles
        </h5>

        {/* *** NUEVO: Buscador de productos por código *** */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <label
            htmlFor="search-code"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Buscar material por Código:
          </label>
          <input
            id="search-code"
            type="text"
            placeholder="Introduce el código del producto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Lista de productos DISPONIBLES (ahora filtrados) */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-8">
            {searchTerm
              ? "No se encontraron productos con ese código."
              : "No hay productos disponibles."}
          </p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <ul className="divide-y divide-gray-200">
              {filteredProducts.map(
                (
                  product: any // Usamos filteredProducts aquí
                ) => (
                  <li
                    key={product.codigo}
                    className="flex items-center justify-between p-4 sm:p-5"
                  >
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500">
                        Codigo: {product.codigo || "N/A"}
                      </p>
                      <p className="text-md font-medium text-gray-900">
                        {product.nombre_producto}
                      </p>
                      <p className="text-sm text-gray-500">
                        Precio: $
                        {parseInt(product.precio_venta).toLocaleString("es-CO")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                      >
                        Agregar material
                      </button>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Sección del Carrito de Compras */}
      <div className="flex-1 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <h5 className="text-normal font-extrabold text-gray-800 text-center mb-6">
          Lista de materiales usados
        </h5>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-8">
            El carrito está vacío. ¡Añade algunos productos!
          </p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 mb-6">
              {cartItems.map((item: any) => (
                <li
                  key={item.codigo}
                  className="flex items-center justify-between p-4 sm:p-5"
                >
                  <div className="flex-grow">
                    <p className="text-md font-medium text-gray-900">
                      {item.nombre_producto}
                    </p>
                    <p className="text-sm text-gray-500">
                      Precio Unitario: $
                      {parseInt(item.precio_venta).toLocaleString("es-CO")}
                    </p>
                    <p className="text-sm text-gray-700 font-semibold">
                      Subtotal: $
                      {(item.quantity * item.precio_venta).toLocaleString(
                        "es-CO"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCartQuantityChange(item.codigo, -1)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                      aria-label="Disminuir cantidad en carrito"
                    >
                      -
                    </button>
                    <input
                      value={item.quantity}
                      readOnly
                      className="w-12 px-2 py-1 text-center bg-gray-100 text-gray-800 rounded-md border border-gray-300"
                    />
                    <button
                      onClick={() => handleCartQuantityChange(item.codigo, 1)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                      aria-label="Aumentar cantidad en carrito"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveFromCart(item.codigo)}
                      className="ml-3 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                      aria-label="Eliminar del carrito"
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Total del Carrito 
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center px-4">
              <h4 className="text-xl font-bold text-gray-800">Total:</h4>
              <span className="text-xl font-bold text-blue-700">
                ${calculateCartTotal().toLocaleString("es-CO")}
              </span>
            </div>
*/}
            {/* Botón para Checkout o Enviar Orden (Ejemplo) */}
            <div className="mt-6 text-center">
              <button
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                onClick={handleSubmit}
              >
                Agregar materiales usados
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductList;
