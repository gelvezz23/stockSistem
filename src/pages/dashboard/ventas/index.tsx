/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export const Ventas = () => {
  const [ventasAgrupadas, setVentasAgrupadas] = useState<any[]>([]);
  const [selectedVentaId, setSelectedVentaId] = useState<number | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [productsToChange, setProductsToChange] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedChangeProducts, setSelectedChangeProducts] = useState<
    Record<number, number | null>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVentaClick = (ventaId: number) => {
    setSelectedVentaId(ventaId === selectedVentaId ? null : ventaId);
    setIsChanging(false); // Reset cambio state when a new venta is selected/unselected
    setProductsToChange([]);
    setSelectedChangeProducts({});
  };

  const handleHacerCambioClick = (detalles: any[]) => {
    setIsChanging(true);
    setProductsToChange(detalles);
    // Fetch available products for change
    fetchAvailableProducts();
  };

  const fetchAvailableProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/productos`, // Assuming you have an endpoint to get all products
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || `Error al obtener productos: ${response.status}`
        );
        return;
      }

      const dataProductos = await response.json();
      setAvailableProducts(dataProductos);
    } catch (err: any) {
      setError(err.message || "Error desconocido al obtener productos");
    }
  };

  const handleProductChangeSelect = (
    detalleId: number,
    newProductId: string
  ) => {
    setSelectedChangeProducts((prev) => ({
      ...prev,
      [detalleId]: parseInt(newProductId),
    }));
  };

  const handleSaveChanges = async (ventaId: number, detalles: any[]) => {
    const changes = detalles.map((detalle) => ({
      detalle_id: detalle.detalle_id,
      nuevo_producto_id:
        selectedChangeProducts[detalle.detalle_id] || detalle.producto_id, // Default to original if no change
    }));

    // Filter out changes where the new product is the same or the price is lower
    const validChanges = changes.filter((change) => {
      const originalProduct = detalles.find(
        (d) => d.detalle_id === change.detalle_id
      );
      const newProduct = availableProducts.find(
        (p) => p.producto_id === change.nuevo_producto_id
      );
      return (
        change.nuevo_producto_id !== originalProduct?.producto_id &&
        newProduct?.precio >= originalProduct?.precio_unitario
      );
    });

    if (validChanges.length === 0) {
      setError(
        "No se seleccionaron cambios válidos (mismo producto o precio menor)."
      );
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/ventas/${ventaId}/cambio`, // Assuming you have an API endpoint for product changes
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cambios: validChanges }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || `Error al realizar el cambio: ${response.status}`
        );
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      setIsChanging(false);
      setSelectedChangeProducts({});
      // Optionally, refresh the ventas list
      // getVentas();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Error desconocido al realizar el cambio");
    }
  };

  useEffect(() => {
    const getVentas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_URL}/api/ventas`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(
            errorData.message || `Error al obtener ventas: ${response.status}`
          );
          setLoading(false);
          return;
        }

        setLoading(false);
        const dataVenta = await response.json();
        setVentasAgrupadas(dataVenta);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Error desconocido al obtener ventas");
      }
    };
    getVentas();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Lista de Ventas
        </h1>
        {loading && <p>cargando...</p>}
        {error && <p className="error-message">{error}</p>}
        <ul className="space-y-4">
          {ventasAgrupadas.map((venta) => (
            <li
              key={venta.venta_id}
              className="bg-white shadow rounded-md overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => handleVentaClick(venta.venta_id)}
              >
                <h2 className="text-sm font-semibold text-gray-700">
                  Venta ID: {venta.venta_id} - {venta.detalles[0].email}
                </h2>
              </div>
              {selectedVentaId === venta.venta_id && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Detalles de la Venta
                  </h3>
                  {venta.detalles.length > 0 ? (
                    <>
                      <ul className="space-y-2">
                        {venta.detalles.map((detalle: any, index: any) => (
                          <li
                            key={index}
                            className="text-gray-500 flex flex-col mb-2 border-b border-gray-300 pb-2"
                          >
                            <span className="font-semibold">
                              Detalle ID: {detalle.detalle_id}
                            </span>
                            <span className="font-semibold">
                              Producto Original: {detalle.nombre_producto} (ID:{" "}
                              {detalle.producto_id}) - $
                              {parseInt(detalle.precio_unitario).toLocaleString(
                                "es-CO"
                              )}
                            </span>
                            {isChanging &&
                              productsToChange.some(
                                (p) => p.detalle_id === detalle.detalle_id
                              ) && (
                                <div className="mt-2">
                                  <label
                                    htmlFor={`change-product-${detalle.detalle_id}`}
                                    className="block text-gray-700 text-sm font-bold mb-1"
                                  >
                                    Cambiar por:
                                  </label>
                                  <select
                                    id={`change-product-${detalle.detalle_id}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={
                                      selectedChangeProducts[
                                        detalle.detalle_id
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleProductChangeSelect(
                                        detalle.detalle_id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">
                                      Seleccionar producto
                                    </option>
                                    {availableProducts
                                      .filter(
                                        (product) =>
                                          Number(product.precio_venta) >=
                                          Number(detalle.precio_unitario)
                                      )
                                      .map((product: any) => (
                                        <option
                                          key={product.producto_id}
                                          value={product.producto_id}
                                        >
                                          {product.nombre_producto} - $
                                          {parseInt(
                                            product.precio_venta
                                          ).toLocaleString("es-CO")}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              )}
                            <span className="font-semibold">
                              Cantidad: {detalle.cantidad}
                            </span>
                            <span className="font-semibold">
                              Subtotal: $
                              {parseInt(detalle.subtotal).toLocaleString(
                                "es-CO"
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {!isChanging ? (
                        <button
                          className="my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          type="button"
                          onClick={() => handleHacerCambioClick(venta.detalles)}
                        >
                          Hacer cambio
                        </button>
                      ) : (
                        <div className="flex space-x-2 my-2">
                          <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() =>
                              handleSaveChanges(venta.venta_id, venta.detalles)
                            }
                          >
                            Guardar Cambios
                          </button>
                          <button
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => setIsChanging(false)}
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">
                      No hay detalles para esta venta.
                    </p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
