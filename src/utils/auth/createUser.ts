/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentData, DocumentReference } from "firebase/firestore";
import {
  IUser,
  registerUserInFirestore,
} from "../firebase/users/Register/users";
import { auth } from "./../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";

const createUser = async ({
  name,
  email,
  password = "",
  userType,
}: IUser): Promise<{
  user?: {
    user: User;
    data: DocumentReference<DocumentData, DocumentData> | undefined | null;
  };
  error?: { code: string; message: string } | unknown | any;
}> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;
    await updateProfile(user, { displayName: name });

    const { data, error } = await registerUserInFirestore({
      name,
      email,
      userType,
      password,
      uid: user.uid,
    });

    if (error) {
      return { user: undefined, error };
    }
    return { user: { user, data }, error: undefined };
  } catch (error) {
    return { user: undefined, error };
  }
};

export default createUser;
