import { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router";
import getUser from "../../utils/auth/getUser";
import ErrorComponent from "../../components/ErrorComponent";
import { useSessionStorage } from "../../utils/hook/useSessionStorage";
import { getRole } from "../../utils/firebase/role";
const Login = () => {
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
      alert("Por favor no envies campos vacios");
    } else {
      const { user, error } = await getUser(valueForm);
      const thereIsAdmin = await getRole({ email: valueForm.email });

      if (error) {
        setError(error?.code || "");
      }
      if (user) {
        setValue({ ...user, thereIsAdmin });
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

        <button className={button} type="submit">
          Iniciar sesion
        </button>
        {err && <ErrorComponent err={err} />}
      </form>
    </section>
  );
};
export default Login;
