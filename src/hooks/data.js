import { useCallback } from "react";
import { useRecoilState } from "recoil";
import rawData from "../data/data.json";
import { dataState } from "../recoil/atoms";

const resetItem = (arr, i) => {
  // populate item
  let item = arr.find((x) => x.id === i);
  // reset if found
  if (item) {
    console.log("Removing", item.id);
    // reset self
    item.value = null;
    // reset each child recursively
    if (Array.isArray(item.options)) {
      item.options.forEach((o) => resetItem(arr, o));
    }
  } else console.error("Couldn't find option", i);
};

export function useData() {
  const [data, setData] = useRecoilState(dataState);

  const updateItem = useCallback(
    (id, value, ofEnum, prevArr) => {
      let result = null;
      setData((s) => {
        let arr = JSON.parse(JSON.stringify(prevArr || s));
        let item = arr.find((i) => i.id === id);
        if (item) {
          // check item of enum parent
          if (ofEnum) {
            let parent = arr.find((i) => i.id === ofEnum);
            if (parent) parent.options.forEach((o) => resetItem(arr, o));
          }
          // if unset occur
          if (!value && Array.isArray(item.options)) {
            item.options.forEach((o) => resetItem(arr, o));
          }
          // update value
          console.log("Setting", id, value, item);
          item.value = value;
          result = arr;
          return arr;
        } else console.error("Couldnt find item", id);
        result = arr;
        return arr;
      });
      return result;
    },
    [setData]
  );

  const resetData = useCallback(() => setData(rawData), [setData]);

  return [data, updateItem, resetData];
}
