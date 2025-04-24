import { useNavigate } from "react-router";
import styles from "./Register.module.css";
import { useState } from "react";
import ErrorComponent from "../../components/ErrorComponent";
import { useSessionStorage } from "../../utils/hook/useSessionStorage";
import useFetchRoles from "../../utils/hook/useFetchRoles";
import useCreateUser from "../../utils/hook/useCreateUser";

const Register = ({ onDashboard = false }) => {
  const { setValue } = useSessionStorage("user", null);

  const navigate = useNavigate();
  const {
    data: roles,
    loading,
    error,
  } = useFetchRoles(`${import.meta.env.VITE_BACK_URL}/api/roles`);
  const {
    createUser,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateUser(`${import.meta.env.VITE_BACK_URL}/api/usuarios`);

  const [valueForm, setValueForm] = useState({
    name: "",
    email: "",
    password: "",
    userType: "cliente",
  });
  const [err] = useState("");
  const { section, form, label, input, button } = styles;
  console.log(valueForm);
  const handleValue = (event: { target: { value: string; name: string } }) => {
    const { value, name } = event.target;
    setValueForm({ ...valueForm, [name]: value });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!valueForm.email || !valueForm.password || !valueForm.name) {
      alert("Por favor no envies campos vacios");
    } else {
      const data = await createUser({
        ...valueForm,
        rol_id: Number(valueForm.userType),
      });

      if (data && onDashboard) {
        setValue(data);
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
          <option key={111} value={4}>
            selecciona
          </option>
          {loading && <option>cargando ...</option>}
          {error && <option>error.</option>}
          {roles.map((rol: { id: number; name_rol: string }) => (
            <option key={rol.id} value={rol.id}>
              {rol.name_rol}
            </option>
          ))}
        </select>

        <button className={button} disabled={loadingCreate} type="submit">
          {!loadingCreate ? "Registrarse" : "Creando..."}
        </button>
        {loadingCreate && <p>cargando...</p>}
        {errorCreate && <p>{errorCreate}</p>}
        {err && <ErrorComponent err={err} />}
      </form>
    </section>
  );
};

export default Register;
