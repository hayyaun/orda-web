import { atom } from "recoil";
import data from "../data/data.json";
import diseases from "../data/disease.json";

const loggerEffect =
  (key) =>
  ({ onSet }) => {
    onSet((data) => {
      console.groupCollapsed(key);
      console.debug(data);
      console.groupEnd();
    });
  };

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
  effects: [loggerEffect("DATA"), localStorageEffect("data")],
});

export const treeState = atom({
  key: "tree",
  default: [],
  effects: [loggerEffect("TREE"), localStorageEffect("tree")],
});

export const diseaseState = atom({
  key: "disease",
  default: diseases,
  effects: [loggerEffect("DISEASE"), localStorageEffect("disease")],
});
