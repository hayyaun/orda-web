import { useCallback } from "react";
import { useRecoilState } from "recoil";
import rawData from "../data/data.json";
import { dataState } from "../recoil/atoms";

export function useData() {
  const [data, setData] = useRecoilState(dataState);

  const updateItem = useCallback(
    (id, value, ofEnum) => {
      console.log(id, value);
      setData((s) => {
        let arr = JSON.parse(JSON.stringify(s));
        let item = arr.find(
          (item) =>
            item.options.includes(id) ||
            item.options.find((option) => option.id === id)
        );

        if (item) {
          item.options.forEach((option) => {
            // if option is of an enum parent -> reset
            if (ofEnum) {
              // if parent -> clear children values
              if (!!option.type === "enum") {
                let optionRef = arr.find((i) => i.id === option.id);
                const optionInitial = rawData.find((i) => i.id === option.id);
                optionRef.options = optionInitial.options;
                optionRef.options.forEach((o) => {
                  // recursion
                  if (typeof o === "string") {
                    updateItem(o, null, optionRef.type === "enum");
                  } else o.value = null;
                });
                console.log("reset options", optionRef, optionInitial);
              }
              // clear value
              if (typeof option === "string") {
                let optionRef = arr.find((i) => i.id === option);
                optionRef.value = null;
              } else option.value = null;
            }

            // if not from enum parent
            // TODO if(value === false) clear all children
            if (typeof option === "string" && option === id) {
              let optionRef = arr.find((i) => i.id === option);
              optionRef.value = value;
            } else if (option.id === id) option.value = value;
          });
        }

        return arr;
      });
    },
    [setData]
  );

  const resetData = useCallback(() => setData(rawData), [setData]);

  return [data, updateItem, resetData];
}
