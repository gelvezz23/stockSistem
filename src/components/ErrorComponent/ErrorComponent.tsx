/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";

const ErrorComponent: FC<{ err: any }> = ({ err }) => {
  console.log(err);
  const dataError: { [value: string]: string } = {
    "auth/email-already-in-use": "El email ya esta registrado",
    "auth/weak-password":
      "Usa un mejor password. Debe tener almenos 6 caracteres",
    "auth/invalid-credential":
      "La cuenta no esta registrada o tu email y password son erroneos",
  };
  const text = dataError[err];

  return <p>{text}</p>;
};

export default ErrorComponent;
