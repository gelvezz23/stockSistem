/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../firebase";

const getUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{
  user?: User;
  error?: { code: string; message: string } | unknown | any;
}> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;
    return { user, error: undefined };
  } catch (error) {
    return {
      user: undefined,
      error,
    };
  }
};

export default getUser;
