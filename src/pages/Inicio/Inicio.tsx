/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { ProductCard } from "../../components/productCard";

const Inicio: FC = () => {
  const [products, setProducts] = useState<any>([]);
  const [errorState, setError] = useState<any>(null);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/productos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) setError("Usuarios no encontrados");

      const data = await response.json();
      setProducts(data);
    };
    getProducts();
  }, []);

  return (
    <div>
      <h1>Bienvenido</h1>
      <section style={{ display: "flex", flexWrap: "wrap" }}>
        {products.map((item: any) => (
          <>
            <ProductCard key={item.producto_id} product={item} />
          </>
        ))}
      </section>
    </div>
  );
};

export default Inicio;
