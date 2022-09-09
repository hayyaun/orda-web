const data = require("./data0.json");
const fs = require("fs");

let arr = [];
data.forEach((item, i) => {
  const { options, ...itemRest } = item;
  const items = Array.isArray(options)
    ? options.filter((o) => typeof o === "object")
    : [];
  const newOptions = options.map((o) => (typeof o === "string" ? o : o.id));
  arr.push({ ...itemRest, options: newOptions });
  arr.push(...items);
});

fs.writeFileSync("data.json", JSON.stringify(arr));
