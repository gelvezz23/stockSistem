/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ErrorComponent from "../../components/ErrorComponent";
import "./ForgotPassword.css";
import useUpdatePassword from "../../utils/hook/useUpdatePassword";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorC, setError] = useState("");

  const { updatePassword, loading, error, success } = useUpdatePassword();

  useEffect(() => {
    if (success) setMessage("Cambio exitoso.");
  }, [success]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Por favor, ingresa tu correo electrónico o contrasena.");
      return;
    }

    try {
      await updatePassword({ email, password });
      setEmail("");
    } catch (error: any) {
      setError(error.code);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-heading">cambiar tu contraseña</h2>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div>
          <label className="forgot-password-label" htmlFor="email">
            Correo Electrónico:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@correo.com"
            className="forgot-password-input"
          />
        </div>

        <div>
          <label className="forgot-password-label" htmlFor="email">
            Nueva contraseña:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event?.target.value)}
            placeholder="nueva contrasena"
            className="forgot-password-input"
          />
        </div>
        <button
          type="submit"
          className="forgot-password-button"
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar Contraseña"}
        </button>

        {message && (
          <p className="forgot-password-message-success">{message}</p>
        )}
        {error && <ErrorComponent err={error || errorC} />}
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
