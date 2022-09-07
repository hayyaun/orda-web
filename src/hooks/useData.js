import { useEffect, useState } from "react";

export default function useData(data) {
  const [pages, setPages] = useState([]);
  useEffect(() => {
    let idsToCheck = [];
    let dataFilled = Array.from(data);
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
          const populatedOption = data.find((d) => d.id === option);
          if (!populatedOption)
            return console.error("Option not found", option);
          if (!populatedOption.id) return console.error("Option has no id");
          header.options[j] = populatedOption;
        }
        const optionId = dataFilled[i].options[j].id;
        idsToCheck.push(optionId);
      }
    }
    setPages(dataFilled.filter((d) => d.page) ?? []);
  }, [data]);

  return pages;
}
