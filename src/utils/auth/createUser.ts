/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "./../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";

const createUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<{
  user?: User;
  error?: { code: string; message: string } | unknown | any;
}> => {
  console.log({ name, email, password });
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;
    await updateProfile(user, { displayName: name });

    return { user, error: undefined };
  } catch (error) {
    return { user: undefined, error };
  }
};

export default createUser;
