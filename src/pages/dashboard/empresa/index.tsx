/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

function CompanyRegistrationForm() {
  // Estados para cada campo del formulario
  const [companyName, setCompanyName] = useState("");
  const [nit, setNit] = useState("");
  const [address, setAddress] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");

  useEffect(() => {
    const getTechnicians = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/empresa/1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      setCompanyName(data.nombre);
      setNit(data.nit);
      setAddress(data.direccion);
    };
    getTechnicians();
  }, []);

  // Manejador del envío del formulario
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Validaciones básicas
    if (!companyName.trim()) {
      setSubmissionMessage("El nombre de la empresa es obligatorio.");
      return;
    }
    if (!nit.trim()) {
      setSubmissionMessage("El NIT es obligatorio.");
      return;
    }
    if (!address.trim()) {
      setSubmissionMessage("La dirección es obligatoria.");
      return;
    }

    await fetch(`${import.meta.env.VITE_BACK_URL}/api/empresa/1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: companyName,
        direccion: address,
        nit,
      }),
    });

    // Aquí es donde normalmente enviarías los datos a un backend
    // Por ahora, solo mostraremos los datos en consola y un mensaje de éxito
    console.log("Datos de la empresa a registrar:");
    console.log("Nombre de la Empresa:", companyName);
    console.log("NIT:", nit);
    console.log("Dirección:", address);

    setSubmissionMessage("¡Empresa actualizada exitosamente!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-black">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Empresa
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de la Empresa:
          </label>
          <input
            type="text"
            id="companyName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required // Atributo HTML para validación básica en el navegador
          />
        </div>

        <div>
          <label
            htmlFor="nit"
            className="block text-sm font-medium text-gray-700"
          >
            NIT:
          </label>
          <input
            type="text"
            id="nit"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={nit}
            onChange={(e) => setNit(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Dirección:
          </label>
          <input
            type="text"
            id="address"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Actualizar Empresa.
        </button>
      </form>

      {/* Mensaje de éxito o error */}
      {submissionMessage && (
        <p
          className={`mt-4 text-center text-sm ${
            submissionMessage.includes("exitosamente")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {submissionMessage}
        </p>
      )}
    </div>
  );
}

export default CompanyRegistrationForm;
