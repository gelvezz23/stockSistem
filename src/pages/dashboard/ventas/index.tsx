/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export const Ventas = () => {
  const [ventasAgrupadas, setVentasAgrupadas] = useState<any[]>([]);
  const [selectedVentaId, setSelectedVentaId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVentaClick = (ventaId: number) => {
    setSelectedVentaId(ventaId === selectedVentaId ? null : ventaId);
  };

  useEffect(() => {
    const getVentas = async () => {
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
            errorData.message || `Error al crear cliente: ${response.status}`
          );
          setLoading(false);
          return;
        }

        setLoading(false);
        const dataVenta = await response.json();
        setVentasAgrupadas(dataVenta);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Error desconocido al crear cliente");
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
                    <ul className="space-y-2">
                      {venta.detalles.map((detalle: any, index: any) => (
                        <>
                          <li
                            key={index}
                            className="text-gray-500 flex flex-col"
                          >
                            <span className="font-semibold">
                              Detalle ID: {detalle.detalle_id}
                            </span>{" "}
                            <span className="font-semibold">
                              Producto ID: {detalle.producto_id}
                            </span>
                            <span className="font-semibold">
                              Producto : {detalle.nombre_producto}
                            </span>
                            <span className="font-semibold">
                              Cantidad: {detalle.cantidad}
                            </span>
                            <span className="font-semibold">
                              Precio Unitario: $
                              {parseInt(detalle.precio_unitario).toLocaleString(
                                "es-CO"
                              )}
                            </span>
                            <span className="font-semibold">
                              Subtotal: $
                              {parseInt(detalle.subtotal).toLocaleString(
                                "es-CO"
                              )}
                            </span>
                          </li>
                          <hr className="border-gray-300" />
                        </>
                      ))}
                    </ul>
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
