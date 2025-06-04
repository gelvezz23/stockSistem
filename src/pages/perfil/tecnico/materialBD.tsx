/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

function MaterialBD({ products }: { id?: any; products: any }) {
  const [availableProducts, setAvailableProducts] = useState<any>([]);
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

        // Parsear newProducts aquí para asegurarnos de que esté disponible
        // y manejar el caso si 'products' no es un JSON válido o está vacío
        let productsToFilter = [];
        try {
          if (products) {
            productsToFilter = JSON.parse(products);
          }
        } catch (e) {
          console.error("Error parsing products prop:", e);
          // Opcional: Podrías querer manejar este error mostrando un mensaje al usuario
        }

        // Obtener un Set de códigos para una búsqueda eficiente
        // Asumiendo que 'productsToFilter' es un array de objetos con una propiedad 'codigo'
        const newProductCodes = new Set(
          productsToFilter.map((p: any) => p.codigo)
        );

        // Filtrar productos por categoria_id === 1 Y por los códigos en newProductCodes
        const newData = data.filter(
          (i: any) => i.categoria_id === 1 && newProductCodes.has(i.codigo)
        );
        console.log(newData);
        setAvailableProducts(newData);
      } catch (error) {
        console.error("Error fetching or filtering products:", error);
        // Podrías manejar un estado de error aquí
      }
    };
    getProducts();
  }, [products]);

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8 text-black">
      {/* Sección de Lista de Productos Disponibles */}
      <div className="flex-1 bg-gray-50 rounded-lg shadow-xl border border-gray-200 p-4">
        <h5 className="text-xl font-extrabold text-gray-800 text-center mb-6">
          Materiales Disponibles
        </h5>

        {/* Lista de productos DISPONIBLES (ahora filtrados) */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {availableProducts.map(
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
                </li>
              )
            )}
            {availableProducts.length === 0 && (
              <li className="flex items-center justify-between p-4 sm:p-5">
                No ha usado ningun material
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Sección del Carrito de Compras */}
    </div>
  );
}

export default MaterialBD;
