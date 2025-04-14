import { useNavigate } from "react-router";
import styles from "./Register.module.css";
import { useState } from "react";
import { createUser } from "../../utils/auth";
import ErrorComponent from "../../components/ErrorComponent";
import { useSessionStorage } from "../../utils/hook/useSessionStorage";

const Register = () => {
  const { setValue } = useSessionStorage("user", null);

  const navigate = useNavigate();
  const [valueForm, setValueForm] = useState({
    name: "",
    email: "",
    password: "",
    userType: "cliente", // Valor por defecto
  });
  const [err, setError] = useState("");
  const { section, form, label, input, button } = styles;

  const handleValue = (event: { target: { value: string; name: string } }) => {
    const { value, name } = event.target;
    setValueForm({ ...valueForm, [name]: value });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!valueForm.email || !valueForm.password || !valueForm.name) {
      alert("Por favor no envies campos vacios");
    } else {
      const { user, error } = await createUser(valueForm);
      if (error) {
        setError(error?.code || "");
      }

      if (user) {
        setValue(user);
        navigate(0);
      }
    }
  };

  return (
    <section className={section}>
      <form className={form} onSubmit={handleSubmit}>
        <label className={label}>Nombre</label>
        <input
          className={input}
          type="text"
          name="name"
          value={valueForm.name}
          onChange={handleValue}
        />

        <label className={label}>Email</label>
        <input
          className={input}
          type="email"
          name="email"
          value={valueForm.email}
          onChange={handleValue}
        />

        <label className={label}>Contraseña</label>
        <input
          className={input}
          type="password"
          name="password"
          value={valueForm.password}
          onChange={handleValue}
        />

        {/* Nuevo select para el tipo de usuario */}
        <label className={label}>Tipo de Usuario</label>
        <select
          className={input}
          name="userType"
          value={valueForm.userType}
          onChange={handleValue}
        >
          <option value="auxiliar de ventas">Auxiliar de Ventas</option>
          <option value="tecnico">Técnico</option>
          <option value="cliente">Cliente</option>
        </select>

        <button className={button} type="submit">
          Registrarse
        </button>
        {err && <ErrorComponent err={err} />}
      </form>
    </section>
  );
};

export default Register;
