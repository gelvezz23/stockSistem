import { NavLink } from "react-router";
import styles from "./Menu.module.css";

const Menu = () => {
  const { sidebar } = styles;

  return (
    <div className={sidebar}>
      <h4>Menú</h4>
      <br />
      <h4>Proveedores</h4>
      <ul>
        <li>
          <NavLink to="providers/create">Crear Proveedor</NavLink>
        </li>
      </ul>
      <br />
      <h4>Usuarios</h4>
      <ul>
        <li>
          <NavLink to="users/create">Crear Usuario</NavLink>
        </li>
      </ul>
      <br />
      <h4>Productos</h4>
      <ul>
        <li>
          <NavLink to="products/create">Crear Productos</NavLink>
        </li>
        <li>
          <NavLink to="products/edit">Editar Productos</NavLink>
        </li>
        <li>
          <NavLink to="products/viewStock">ver stock</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
