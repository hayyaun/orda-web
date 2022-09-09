import { useCallback } from "react";
import { useRecoilState } from "recoil";
import rawData from "../data/data.json";
import { dataState } from "../recoil/atoms";

// TODO flatten data.json -> use string value for enum

const resetItem = (arr, i) => {
  // populate item
  let item = null;
  if (typeof i === "string") item = arr.find((x) => x.id === i);
  else item = i;

  // reset if found
  if (item) {
    console.log("Removing item", item.id);
    // reset self
    item.value = null;
    // reset each child using updateItem
    if (Array.isArray(item.options)) {
      item.options.forEach((o) => {
        resetItem(arr, o);
      });
    }
  } else console.error("Couldn't find option", i);
};

export function useData() {
  const [data, setData] = useRecoilState(dataState);

  const updateItem = useCallback(
    (id, value, ofEnum) => {
      setData((s) => {
        let arr = JSON.parse(JSON.stringify(s));
        let item =
          arr.find((i) => i.id === id) ||
          arr
            .find((i) => i.options.find((i) => i.id === id))
            .options.find((i) => i.id === id);

        if (item) {
          console.log(id, value, item);
          // check (item of enum parent) or (new value = null) -> resetItem
          if (ofEnum || false) {
            let parent = arr.find((i) => i.id === ofEnum);
            if (parent)
              parent.options.forEach((o) => {
                resetItem(arr, o);
              });
          }
          // update value
          item.value = value;
          return arr;
        } else console.error("Couldnt find item", id);

        return arr;
      });
    },
    [setData]
  );

  const resetData = useCallback(() => setData(rawData), [setData]);

  return [data, updateItem, resetData];
}
