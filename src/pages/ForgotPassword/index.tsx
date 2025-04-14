/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction, useState } from "react";
import { handleForgotPassword } from "../../utils/firebase/users/forgotPasword";
import ErrorComponent from "../../components/ErrorComponent";
import "./ForgotPassword.css";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {
      const message = await handleForgotPassword(email);
      setMessage(message);
      setEmail("");
    } catch (error: any) {
      setError(error.code);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-heading">¿Olvidaste tu contraseña?</h2>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div>
          <label className="forgot-password-label" htmlFor="email">
            Correo Electrónico:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChange}
            placeholder="tu@correo.com"
            className="forgot-password-input"
          />
        </div>
        <button type="submit" className="forgot-password-button">
          Enviar enlace de restablecimiento
        </button>

        {message && (
          <p className="forgot-password-message-success">{message}</p>
        )}
        {error && <ErrorComponent err={error} />}
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
