import { createContext } from "react";

//credentials context
export const CredentailsContext = createContext({storedCredentials: {}, setStoredCredentials: () => {}})