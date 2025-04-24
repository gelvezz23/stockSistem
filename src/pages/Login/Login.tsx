import { useState } from "react";
import styles from "./Login.module.css";
import { NavLink, useNavigate } from "react-router";
import ErrorComponent from "../../components/ErrorComponent";
import { useSessionStorage } from "../../utils/hook/useSessionStorage";
import useLogin from "../../utils/hook/useLogin";
const Login = () => {
  const { login, user, loading, error, isLoggedIn } = useLogin();

  const { setValue } = useSessionStorage("user", null);
  const navigate = useNavigate();
  const [err, setError] = useState("");

  const [valueForm, setValueForm] = useState({
    email: "",
    password: "",
  });
  const { section, form, label, input, button } = styles;

  const handleValue = (event: { target: { value: string; name: string } }) => {
    const { value, name } = event.target;
    setValueForm({ ...valueForm, [name]: value });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!valueForm.email || !valueForm.password) {
      setError("Por favor no envies campos vacios");
    } else {
      await login({ ...valueForm });
      if (error) {
        setError(error || "");
      }
      if (user && isLoggedIn) {
        const thereIsAdmin = user?.rol_id === 1;
        setValue({ user, thereIsAdmin });
        if (thereIsAdmin) navigate("/dashboard");
        navigate(0);
      }
    }
  };

  return (
    <section className={section}>
      <form className={form} onSubmit={handleSubmit}>
        <h1>Bienvenido</h1>
        <label className={label}>Email</label>
        <input
          className={input}
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleValue}
          required
        />

        <label className={label}>Password</label>
        <input
          className={input}
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleValue}
          required
        />

        <button className={button} type="submit" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
        <NavLink to="/forgotPassword">Olvide mi contrasena.</NavLink>
        {err && <ErrorComponent err={err} />}
      </form>
    </section>
  );
};
export default Login;
