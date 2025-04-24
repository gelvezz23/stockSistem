/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

interface IUser {
  name: string;
  email: string;
  password?: string;
  rol_id: number; // Asumiendo que tienes un rol_id en tu formulario
}

function useCreateUser(url: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createUser = async (userData: IUser) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: userData.name, // Mapea 'name' al campo 'nombre_usuario' de tu backend
          email: userData.email,
          contrasena: userData.password,
          rol_id: userData.rol_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || `Error al crear usuario: ${response.status}`
        );
        return;
      }

      const data = await response.json();
      setSuccess(true);
      console.log("Usuario creado:", data);
      return data;
    } catch (err: any) {
      setError(err.message || "Error desconocido al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error, success };
}

export default useCreateUser;
