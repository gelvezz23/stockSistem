import { useState } from "react";
import Modal from "../../../components/Modal";

const Create = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h1>Hola !! soy un modal</h1>
      </Modal>
      <h4>Crear Provedores</h4>
      <form id="productoForm">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Provedor:</label>
          <input type="text" id="nombre" name="nombre" required />
        </div>
        <div className="form-group">
          <button type="submit"> crear </button>
        </div>
      </form>

      <section>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de Proveedor</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Proveedor ABC</td>
              <td className="actions">
                <button className="edit-button" onClick={openModal}>
                  Editar
                </button>
                <button className="delete-button" onClick={openModal}>
                  Eliminar
                </button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Distribuidora XYZ</td>
              <td className="actions">
                <button className="edit-button">Editar</button>
                <button className="delete-button">Eliminar</button>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>Suministros Globales</td>
              <td className="actions">
                <button className="edit-button">Editar</button>
                <button className="delete-button">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Create;
