/* eslint-disable @typescript-eslint/no-explicit-any */
import "./styles.css";
export const ProductCard = ({ product }: { product: any }) => {
  console.log(product);
  return (
    <div className="producto-card">
      <img
        src={product.image_url}
        width="200px"
        height="200px"
        alt="Nombre del Producto"
      />
      <div className="producto-info">
        <h3>{product.nombre_producto}</h3>
        <p className="descripcion">{product.descripcion}</p>
        <p className="precio">${product.precio_venta}</p>
        <button>Ver Detalles</button>
      </div>
    </div>
  );
};
