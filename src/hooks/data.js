import { useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";
import { dataState } from "../recoil/atoms";
import rawData from "../data/data.json";

export function useData() {
  const [data, setData] = useRecoilState(dataState);

  // to-nested
  const pages = useMemo(() => {
    let idsToCheck = [];
    let dataFilled = JSON.parse(JSON.stringify(data));
    for (let i = dataFilled.length - 1; i >= 0; --i) {
      let header = dataFilled[i];
      const headerId = header.id;
      if (idsToCheck.includes(headerId))
        console.error("header id already exists", headerId);
      idsToCheck.push(headerId);
      if (!header.options) return console.error("options not defined", header);
      for (let j = header.options.length - 1; j >= 0; --j) {
        let option = header.options[j];
        if (typeof option === "string") {
          let populatedOption = data.find((d) => d.id === option);
          if (!populatedOption)
            return console.error("Option not found", option);
          if (!populatedOption.id) return console.error("Option has no id");
          console.log(header.options[j], j);
          dataFilled[i].options[j] = populatedOption;
        }
        const optionId = dataFilled[i].options[j].id;
        idsToCheck.push(optionId);
      }
    }
    return dataFilled.filter((d) => d.page) ?? [];
  }, [data]);

  // update-flatten
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
            if (ofEnum) {
              if (typeof option === "string") {
                let optionRef = arr.find(option);
                optionRef.value = false;
              } else option.value = false;
            }

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

  return [pages, updateItem, resetData];
}
