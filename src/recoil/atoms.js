import { atom } from "recoil";
import data from "../data/data.json";

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const dataState = atom({
  key: "data",
  default: data,
  effects: [
    ({ onSet }) => {
      onSet((data) => {
        console.debug("Data:", data);
      });
    },
    localStorageEffect("data"),
  ],
});

export const treeState = atom({
  key: "tree",
  default: [],
  effects: [
    ({ onSet }) => {
      onSet((data) => {
        console.debug("Tree:", data);
      });
    },
    localStorageEffect("tree"),
  ],
});
