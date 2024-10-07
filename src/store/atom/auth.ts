import { atom } from "recoil";

export const authState = atom({
  key: "auth-atom",
  default: false,
});
