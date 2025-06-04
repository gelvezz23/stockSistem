/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useSessionStorage } from "../../utils/hook/useSessionStorage";
import { FormsClient } from "../dashboard/usersList/form";
import Modal from "../../components/Modal";
import FormServicioTecnico from "../../components/FormServicioTecnico";
import { IconoProceso } from "../../components/iconos/iconoProceso";
import { IconoReagendar } from "../../components/iconos/iconoReagendar";
import { DateTimer } from "../dashboard/citas/dateTimer";

export const Cliente = () => {
  const { storage } = useSessionStorage("user", null);
  const [viewModalEdit, setViewModalEdit] = useState(false);
  const [open3, setModal3] = useState(false);
  const [minDate, setMinDate] = useState("");

  const [viewModalServicio, setViewModalServicio] = useState(false);
  const [clientsState, setClientState] = useState({
    nombre_cliente: "",
    documento: "",
    direccion: "",
    telefono: "",
    email: "",
    usuario_id: storage?.user?.usuario_id, // Use optional chaining
  });
  const [errorData, setError] = useState<string | null>(null);
  const [loadingData, setLoading] = useState(true); // Initialize loading to true
  const [citas, setCitas] = useState<any>([]);
  const [selectedClient, setSelectedClient] = useState<any>();
  const [_products, setProducts] = useState<any>();
  const [selectedDate, setSelectedDate] = useState<any>();
  const [selectedTime, setSelectedTime] = useState<any>();
  const [showTime, setShowTime] = useState(false);

  const handleShowSelectTimer = () => {
    setShowTime(!showTime);
  };
  const fechaInicioFormateada = useCallback(() => {
    return selectedDate ? `${selectedDate} ${selectedTime}:00` : undefined;
  }, [selectedDate, selectedTime]);
  const fecha = fechaInicioFormateada();

  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_URL}/api/getServicioTecnico`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const newData = data.filter(
          (item: any) => item.cliente_id === clientsState.usuario_id
        );
        setCitas(newData);
      } catch (e: any) {
        setError("Error al cargar las citas: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  useEffect(() => {
    const getClient = async () => {
      setLoading(true);
      setError(null);

      try {
        if (storage?.user?.usuario_id) {
          const response = await fetch(
            `${import.meta.env.VITE_BACK_URL}/api/clientes/${
              storage.user.usuario_id
            }`,
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
              errorData.message || `Usuario no encontrado: ${response.status}`
            );
            setLoading(false);
            return;
          }
          const data = await response.json();
          setClientState({
            nombre_cliente: data.nombre_cliente || "",
            documento: data.documento || "",
            direccion: data.direccion || "",
            telefono: data.telefono || "",
            email: data.email || "",
            usuario_id: data.usuario_id,
          });
          setLoading(false);
        } else {
          setError("No se encontró la información del usuario.");
          setLoading(false);
        }
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Error desconocido al obtener cliente");
      }
    };

    getClient();
  }, [storage?.user?.usuario_id]); // Use optional chaining in dependency array

  useEffect(() => {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses son 0-indexados
    const day = String(today.getDate()).padStart(2, "0");
    setMinDate(`${year}-${month}-${day}`);
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

  if (loadingData) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">Cargando perfil...</div>
      </div>
    );
  }

  if (errorData) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center flex-col">
        <div className="text-red-500 text-xl">{errorData}</div>
        <div className="text-red-500 text-xl">Completa tu perfil</div>
        <FormsClient user={clientsState} />
      </div>
    );
  }

  const handleEditClickEdit = () => {
    setViewModalEdit(!viewModalEdit);
  };

  const handleEditClickServicio = () => {
    setViewModalServicio(!viewModalServicio);
  };

  console.log({ citas, clientsState });

  const compareFechaCitas = (cita: any) => {
    const fechaCita = new Date(cita.fecha_inicio);
    const fechaActual = new Date();
    console.log("TT", fechaCita < fechaActual);
    if (fechaCita < fechaActual) {
      return true;
    }
    return false;
  };

  const handleOpenDataModal = (cita: any) => {
    setSelectedClient(cita.servicio_id);
    setProducts(cita.producto_id);
  };
  const handleSubmitEdit = async (e: any) => {
    e.preventDefault();
    const body = {
      fecha_inicio: fecha,
      cliente_id: selectedClient,
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
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <Modal isOpen={viewModalEdit} onClose={handleEditClickEdit}>
        <FormsClient user={clientsState} />
      </Modal>

      <Modal isOpen={viewModalServicio} onClose={handleEditClickServicio}>
        <FormServicioTecnico />
      </Modal>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Perfil de Cliente
        </h1>
        <div className="flex p-4 gap-4">
          <button
            onClick={handleEditClickEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Editar
          </button>

          <button
            onClick={handleEditClickEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Agenda
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">
              Información Personal
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detalles de tu cuenta.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {clientsState.nombre_cliente}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Documento</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {clientsState.documento}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {clientsState.email}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {clientsState.telefono}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {clientsState.direccion}
                </dd>
              </div>
              {/* Puedes agregar más campos aquí si es necesario */}
            </dl>
          </div>
        </div>

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
                      Observación
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
                          {cita.observacion || "-"}
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
                            <button
                              className="flex items-center"
                              onClick={() => {
                                handleOpenDataModal(cita);
                                setModal3(!open3);
                              }}
                            >
                              <IconoReagendar /> reagendar
                            </button>
                          )}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
              {/** REAGENDAR */}
              <Modal isOpen={open3} onClose={() => setModal3(!open3)}>
                <form
                  className="h-full w-full p-[1rem]"
                  onSubmit={handleSubmitEdit}
                >
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
                          <span className=" text-gray-700">
                            Hora: {selectedTime}
                          </span>
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
          )}
        </div>
      </div>
    </div>
  );
};
