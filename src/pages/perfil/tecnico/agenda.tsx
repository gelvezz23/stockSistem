/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useSessionStorage } from "../../../utils/hook/useSessionStorage";
import Modal from "../../../components/Modal";
import ImageUploaderFetch from "./imagenUpload";
import { DateTimer } from "../../dashboard/citas/dateTimer";
import { IconoEditar } from "../../../components/iconos/iconoEditar";
import { IconoProceso } from "../../../components/iconos/iconoProceso";
import { IconoReagendar } from "../../../components/iconos/iconoReagendar";

const ListarCitasPerfil = () => {
  const { storage } = useSessionStorage("user", null);
  const [open, setModal] = useState(false);
  const [open2, setModal2] = useState(false);
  const [open3, setModal3] = useState(false);

  const [citas, setCitas] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [garantia, setGarantia] = useState<any>();
  const [estado, setestado] = useState<any>();
  const [descripcion, setDescripcion] = useState<any>();

  const [selectedDate, setSelectedDate] = useState<any>();
  const [showTime, setShowTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState<any>();
  const [selectedClient, setSelectedClient] = useState<any>();

  const fechaInicioFormateada = useCallback(() => {
    return selectedDate ? `${selectedDate} ${selectedTime}:00` : undefined;
  }, [selectedDate, selectedTime]);
  const fecha = fechaInicioFormateada();
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_URL}/api/getServicioTecnico/${
            storage?.user?.usuario_id
          }`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCitas(data);
      } catch (e: any) {
        setError("Error al cargar las citas: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() devuelve de 0 a 11
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses son 0-indexados
    const day = String(today.getDate()).padStart(2, "0");
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando citas...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const compareFechaCitas = (cita: any) => {
    const fechaCita = new Date(cita.fecha_inicio);
    const fechaActual = new Date();
    console.log("TT", fechaCita < fechaActual);
    if (fechaCita < fechaActual) {
      return true;
    }
    return false;
  };

  const handleShowSelectTimer = () => {
    setShowTime(!showTime);
  };

  const handleSubmitEdit = async (e: any) => {
    e.preventDefault();
    const body = {
      garantia: garantia,
      fecha_inicio: fecha,
      cliente_id: selectedClient,
      estado,
      solucion: descripcion,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/citas/update`,
        {
          method: "PUT", // Utilizamos PUT para actualizar un recurso existente
          headers: {
            "Content-Type": "application/json", // Indicamos que el cuerpo de la solicitud es JSON
          },
          body: JSON.stringify(body), // Convertimos el objeto JavaScript 'body' a una cadena JSON
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

  const handleOpenDataModal = (cita: any) => {
    setSelectedClient(cita.servicio_id);
  };

  return (
    <div className="container mx-auto py-8 text-gray-900">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Citas Agendadas
      </h1>
      {citas.length === 0 ? (
        <p className="text-gray-600">No hay citas agendadas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Fecha Inicio
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Técnico
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Garantía
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Solución
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Evidencia
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  .
                </th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita: any, index: any) => (
                <>
                  <tr key={`${cita.servicio_id}_${index}`}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {`${formatDate(cita.fecha_inicio)
                        .split(" ")[0]
                        .replace(/\//g, "")}_${cita.servicio_id}`}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {formatDate(cita.fecha_inicio)}
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita?.cliente_documento} - {cita.cliente_email}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.tecnico_documento} - {cita.tecnico_email}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.diagnostico || "-"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.estado || "-"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.direccion_servicio}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.garantia}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.descripcion_problema}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.solucion || "-"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.imagen_evidencia ? (
                        <img
                          src={cita?.imagen_evidencia}
                          className="w-[4rem] h-[4rem]"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="flex flex-col h-[7rem] w-full gap-2 px-2 py-5 border-b border-gray-200 bg-white text-sm">
                      {compareFechaCitas(cita) ? (
                        <>
                          <button
                            className="flex items-center "
                            onClick={() => {
                              alert(
                                "No puede editar ni cancelar esta cita. Ya esta en proceso."
                              );
                            }}
                          >
                            <IconoProceso />
                            En proceso
                          </button>

                          <button
                            className="flex items-center"
                            onClick={() => {
                              handleOpenDataModal(cita);
                              setModal3(!open3);
                            }}
                          >
                            <IconoReagendar /> reagendar
                          </button>
                        </>
                      ) : (
                        <>
                          <span
                            className="underline cursor-pointer flex items-center"
                            onClick={() => {
                              handleOpenDataModal(cita);
                              setModal(!open);
                            }}
                          >
                            <IconoEditar />
                            Ejecutar
                          </span>

                          <span
                            className="underline cursor-pointer flex items-center w-[12rem]"
                            onClick={() => {
                              handleOpenDataModal(cita);
                              setModal2(!open2);
                            }}
                          >
                            <IconoEditar />
                            registar incumplimiento
                          </span>
                        </>
                      )}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/** EJECUTAR */}

      <Modal isOpen={open} onClose={() => setModal(!open)}>
        <ImageUploaderFetch id={selectedClient} />
        <form className="h-full w-full p-[1rem]" onSubmit={handleSubmitEdit}>
          <div className="col-span-full">
            <label
              htmlFor="descripcion"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Tiene Garantia (opcional)
            </label>

            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setGarantia(e.target.value)}
            >
              <option>Seleccione una opcion</option>
              <option value="No"> No</option>
              <option value="Si"> Si</option>
            </select>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="descripcion"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Estado (opcional)
            </label>

            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setestado(e.target.value)}
            >
              <option>Seleccione una opcion</option>
              <option value="pendiente"> pendiente</option>
              <option value="en garantia"> en garantia</option>
              <option value="terminado"> terminado</option>
            </select>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="descripcion"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Solucion.
            </label>
            <textarea
              id="descripcion"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Enviar
          </button>
        </form>
      </Modal>
      {/** INCUMPLIMIENTO */}
      <Modal
        key={121}
        isOpen={open2}
        onClose={() => {
          setModal2(!open2);
        }}
      >
        <>
          <ImageUploaderFetch id={selectedClient} />
          <form className="h-full w-full p-[1rem]" onSubmit={handleSubmitEdit}>
            <div className="col-span-full">
              <label
                htmlFor="descripcion"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Tiene Garantia (opcional)
              </label>

              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setGarantia(e.target.value)}
              >
                <option>Seleccione una opcion</option>
                <option value="No"> No</option>
                <option value="Si"> Si</option>
              </select>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="descripcion"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Estado (opcional)
              </label>

              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setestado(e.target.value)}
              >
                <option>Seleccione una opcion</option>
                <option value="pendiente"> pendiente</option>
                <option value="en garantia"> en garantia</option>
                <option value="terminado"> terminado</option>
              </select>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="descripcion"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Solucion.
              </label>
              <textarea
                id="descripcion"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={2}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Enviar
            </button>
          </form>
        </>
      </Modal>

      {/** REAGENDAR */}
      <Modal isOpen={open3} onClose={() => setModal3(!open3)}>
        <form className="h-full w-full p-[1rem]" onSubmit={handleSubmitEdit}>
          <div className="col-span-full">
            <label
              htmlFor="horaCita"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Fecha de cita (opcional)
            </label>

            <input
              type="date"
              id="fechaCita"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDate}
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="horaCita"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Hora de cita (opcional)
            </label>
            <div className="flex flex-col">
              <button
                className="flex w-full gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                type="button"
                onClick={handleShowSelectTimer}
              >
                Seleccionar{" "}
                {selectedTime ? (
                  <span className=" text-gray-700">Hora: {selectedTime}</span>
                ) : (
                  <span className=" text-gray-700">Hora: ...</span>
                )}
              </button>
              {showTime && (
                <DateTimer
                  citas={citas}
                  fechaInicioFormateada={fecha}
                  handleShowSelectTimer={handleShowSelectTimer}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                />
              )}
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Enviar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ListarCitasPerfil;
