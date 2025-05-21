/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import EmailDropdown from "./Dropdown";
import { DateTimer } from "./dateTimer";

const CrearCita = () => {
  const [users, setUsers] = useState<any>([]);
  const [tecnicos, setTecnicos] = useState<any>([]);
  const [errorState, setError] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showTime, setShowTime] = useState(false);
  const [selectedClient, setSelectedClient] = useState("Seleccionar Cliente");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [citas, setCitas] = useState();

  const fechaInicioFormateada = useCallback(() => {
    return `${selectedDate} ${selectedTime}:00`;
  }, [selectedDate, selectedTime]);
  const fecha = fechaInicioFormateada();
  console.log("YY", fecha);
  console.log("citas", citas);
  const [direccion, setDireccion] = useState("");
  const [selectedService, setSelectedService] = useState(
    "Seleccione servicios"
  );
  const [problemDescription, setProblemDescription] = useState("");
  console.log({ users, tecnicos });
  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/clientes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) setError("Usuarios no encontrados");

      const data = await response.json();
      const dataFull = data.filter((item: any) => item.rol_id === 4);
      setUsers(dataFull);
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getTechnicians = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/clientes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) setError("Técnicos no encontrados");

      const data = await response.json();
      const dataFull = data.filter((item: any) => item.rol_id === 3);

      setTecnicos(dataFull);
    };
    getTechnicians();
  }, []);

  const fetchCitas = async (valueId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/getDateTecnico/${valueId}`
      );
      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCitas(data);
    } catch (e: any) {
      setError("Error al cargar las citas: " + e.message);
    }
  };

  const handleClientSelect = (email: string) => {
    setSelectedClient(email);
    // Aquí podrías buscar el ID del cliente basado en el email seleccionado
  };

  const handleTechnicianSelect = (email: string) => {
    setSelectedTechnician(email);
    fetchCitas(email);
    // Aquí podrías buscar el ID del técnico basado en el email seleccionado
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (!selectedClient || !selectedTechnician) {
      alert("Seleccione un tecnico y un cliente");
    }
    event.preventDefault();

    const response: any = await fetch(
      `${import.meta.env.VITE_BACK_URL}/api/crearServicioTecnico`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          producto_id: null,
          fecha_fin: null,
          solucion: null,
          estado: "agendado",
          garantia: null,
          fecha_inicio: fecha,
          cliente_id: selectedClient,
          tecnico_id: selectedTechnician,
          diagnostico: selectedService,
          descripcion_problema: problemDescription,
          direccion_servicio: direccion,
        }),
      }
    );
    if (!response.ok) setError("Un error inesperado" + response);

    const data = await response.json();
    if (data) {
      alert(data.message);
      window.location.reload();
    }
  };

  if (errorState) {
    return <p className="text-red-500">{errorState}</p>;
  }

  const handleShowSelectTimer = () => {
    setShowTime(!showTime);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Crear Nueva Cita
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="cliente"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Documento del cliente
          </label>
          <EmailDropdown
            emails={users}
            onSelect={handleClientSelect}
            selected={selectedClient}
          />
        </div>
        <div>
          <label
            htmlFor="tecnico"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Seleccione técnico
          </label>
          <EmailDropdown
            emails={tecnicos}
            onSelect={handleTechnicianSelect}
            selected={selectedTechnician}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="fechaCita"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Fecha de cita
          </label>
          <input
            disabled={!selectedTechnician}
            type="date"
            id="fechaCita"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="horaCita"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Hora de cita
          </label>
          <button
            className="flex w-full gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            type="button"
            disabled={selectedTechnician === "" || selectedDate === ""}
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
        <div>
          <label
            htmlFor="servicio"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Servicio
          </label>
          <div className="relative">
            <select
              id="servicio"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option>Seleccione servicios</option>
              <option value="Reparacion">Reparación</option>
              <option value="Revision">Revisión</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="col-span-full">
          <label
            htmlFor="descripcion"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Descripción del problema
          </label>
          <textarea
            id="descripcion"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="col-span-full">
          <label
            htmlFor="descripcion"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Direccion de la cita.
          </label>
          <textarea
            id="direccion"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={2}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          ></textarea>
        </div>
      </div>
      {errorState && <p className="text-red-500">{errorState}</p>}
      <button
        type="submit"
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Crear Cita
      </button>
    </form>
  );
};

export default CrearCita;
