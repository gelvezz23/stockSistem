const Create = () => {
  return (
    <>
      <h1>Ingrese los Datos del Producto</h1>

      <form id="productoForm">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Producto:</label>
          <input type="text" id="nombre" name="nombre" required />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea id="descripcion" name="descripcion" rows={5}></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            name="precio"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="url_imagen">URL de la Imagen:</label>
          <input type="text" id="url_imagen" name="url_imagen" />
        </div>

        <div className="image-preview-container">
          <label>Vista Previa de la Imagen:</label>
          <img
            id="vistaPrevia"
            src="#"
            alt="Vista previa de la imagen"
            className="image-preview"
          />
          <p id="mensajeNoImagen">Ingrese una URL para ver la imagen.</p>
        </div>

        <div className="form-group">
          <label htmlFor="cantidad">Cantidad:</label>
          <input type="number" id="cantidad" name="cantidad" min="0" required />
        </div>

        <button type="submit">Guardar Producto</button>
      </form>
    </>
  );
};

export default Create;
