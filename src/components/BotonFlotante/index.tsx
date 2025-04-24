/* eslint-disable @typescript-eslint/no-explicit-any */
import "./styles.css";

const BotonFlotante = ({
  onClick,
  children,
}: {
  onClick: any;
  children: any;
}) => {
  return (
    <button className="boton-flotante" onClick={onClick}>
      {children} {/* Aquí puedes pasar un icono, texto, etc. */}
    </button>
  );
};

export default BotonFlotante;
