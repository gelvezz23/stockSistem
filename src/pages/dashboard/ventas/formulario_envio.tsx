export const FormularioEnvio = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center border-b-2 pb-4 border-gray-200">
        Registro de Envío
      </h2>
      <form id="shipmentForm" className="space-y-6">
        <div>
          <label
            htmlFor="venta_id"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            ID de Venta:
          </label>
          <input
            type="text"
            id="venta_id"
            name="venta_id"
            value="VNT-2024-001"
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="fecha_envio"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Fecha de Envío:
          </label>
          <input
            type="date"
            id="fecha_envio"
            name="fecha_envio"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="direccion_entrega"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Dirección de Entrega:
          </label>
          <input
            type="text"
            id="direccion_entrega"
            name="direccion_entrega"
            required
            placeholder="Ej: Calle 123 #45-67"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="ciudad_entrega"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Ciudad de Entrega:
          </label>
          <input
            type="text"
            id="ciudad_entrega"
            name="ciudad_entrega"
            required
            placeholder="Ej: Bogotá"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="departamento_entrega"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Departamento de Entrega:
          </label>
          <input
            type="text"
            id="departamento_entrega"
            name="departamento_entrega"
            required
            placeholder="Ej: Cundinamarca"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="codigo_postal_entrega"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Código Postal:
          </label>
          <input
            type="text"
            id="codigo_postal_entrega"
            name="codigo_postal_entrega"
            pattern="[0-9]{5,}"
            placeholder="Ej: 110111"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="metodo_envio"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Método de Envío:
          </label>
          <select
            id="metodo_envio"
            name="metodo_envio"
            required
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
          >
            <option value="">Seleccione un método</option>
            <option value="estandar">Estándar</option>
            <option value="express">Express</option>
            <option value="recogida">Recogida en Tienda</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="numero_seguimiento"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Número de Seguimiento:
          </label>
          <input
            type="text"
            id="numero_seguimiento"
            name="numero_seguimiento"
            placeholder="Ej: ABC123456789"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="estado_entrega"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Estado de Entrega:
          </label>
          <select
            id="estado_entrega"
            name="estado_entrega"
            required
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
          >
            <option value="">Seleccione un estado</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_transito">En Tránsito</option>
            <option value="entregado">Entregado</option>
            <option value="fallido">Intento de Entrega Fallido</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="fecha_entrega_estimada"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Fecha de Entrega Estimada:
          </label>
          <input
            type="date"
            id="fecha_entrega_estimada"
            name="fecha_entrega_estimada"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="fecha_entrega_real"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Fecha de Entrega Real:
          </label>
          <input
            type="date"
            id="fecha_entrega_real"
            name="fecha_entrega_real"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="observaciones"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Observaciones:
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y focus:border-blue-500"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="usuario_responsable_id"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            ID de Usuario Responsable:
          </label>
          <input
            type="text"
            id="usuario_responsable_id"
            name="usuario_responsable_id"
            value="USR-007"
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
        >
          Registrar Envío
        </button>
      </form>
    </div>
  );
};
