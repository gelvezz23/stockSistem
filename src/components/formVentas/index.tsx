/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from "react";
import { createVenta } from "./createVenta";
import { createVentaDetalle } from "./createVentaDetalle";

export const FormVentas: FC<{
  clients: any;
  auxiliaries: any;
  totalPrice: any;
  products: any;
}> = ({ clients, auxiliaries, totalPrice, products }) => {
  const [selectedAuxiliary, setSelectedAuxiliary] = useState<
    number | string | ""
  >(0);
  const [selectedClient, setSelectedClient] = useState<number | string | "">(
    ""
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuxiliaryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const auxiliaryId = event.target.value;
    setSelectedAuxiliary(auxiliaryId);
  };

  const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = event.target.value;
    setSelectedClient(clientId);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const venta_id = await createVenta({
      setError,
      setLoading,
      selectedAuxiliary,
      selectedClient,
      totalPrice,
    });
    if (venta_id) {
      const ventaDetalle = await createVentaDetalle({
        setError,
        setLoading,
        venta_id,
        products,
      });
      console.log(ventaDetalle);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <p className="text-gray-900">
          Subtotal: $ {parseInt(totalPrice).toLocaleString("es-CO")}
        </p>
        <p className="text-gray-900">
          IVA (19%): $ {(parseInt(totalPrice) * 0.19).toLocaleString("es-CO")}
        </p>
        <p className="text-gray-900 font-semibold">
          Precio Total (con IVA): ${" "}
          {(parseInt(totalPrice) * 1.19).toLocaleString("es-CO")}
        </p>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="auxiliary"
        >
          Seleccionar Auxiliar:
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="auxiliary"
          value={selectedAuxiliary}
          onChange={handleAuxiliaryChange}
        >
          <option value="">-- Seleccionar Auxiliar --</option>
          {auxiliaries.map(
            (auxiliary: { usuario_id: number; email: string }) => (
              <option key={auxiliary.usuario_id} value={auxiliary.usuario_id}>
                {auxiliary.email}
              </option>
            )
          )}
        </select>
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="client"
        >
          Seleccionar Cliente:
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="client"
          value={selectedClient}
          onChange={handleClientChange}
        >
          <option value="">-- Seleccionar Cliente --</option>
          {clients.map((client: { usuario_id: number; email: string }) => (
            <option key={client.usuario_id} value={client.usuario_id}>
              {client.email}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <button
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Crear venta"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
      {/* Puedes agregar más campos del formulario aquí */}
      {/* <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Enviar
      </button> */}
    </form>
  );
};
