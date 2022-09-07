import useData from "./hooks/useData";
import rawData from "./data/data.json";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  Stack,
} from "@mui/material";

function App() {
  const [data, setData] = useState(rawData);
  const pages = useData(data);
  const [pageIndex, setPageIndex] = useState(0);
  const currPage = Array.isArray(pages) ? pages[pageIndex] : null;
  const canGoBack = pageIndex > 0;
  const canGoForward = pageIndex < pages?.length - 1;
  const handlePrev = () => {
    if (canGoBack) setPageIndex((i) => i - 1);
  };
  const handleNext = () => {
    if (canGoForward) setPageIndex((i) => i + 1);
  };
  const updateItem = (id, value, ofEnum) => {
    console.log(id, value);
    setData((s) => {
      let arr = Array.from(s);
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
            let optionRef = arr.find(option);
            optionRef.value = value;
          } else if (option.id === id) option.value = value;
        });
      }

      return arr;
    });
  };

  return (
    <Stack gap={4}>
      <Page data={currPage} updateItem={updateItem} />
      <Stack direction="row" gap={1}>
        <Button variant="contained" onClick={handlePrev} disabled={!canGoBack}>
          Prev Page
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!canGoForward}
        >
          Next Page
        </Button>
      </Stack>
    </Stack>
  );
}

export default App;

const Page = ({ data, updateItem }) => {
  const [expanded, setExpanded] = useState([]);
  const handleToggle = (id) => {
    setExpanded((s) => {
      let arr = Array.from(s);
      let index = s.indexOf(id);
      if (index < 0) arr.push(id);
      else arr.splice(index, 1);
      return arr;
    });
  };
  return (
    data && (
      <div>
        <h1>{data.name}</h1>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          selected={[]}
          onNodeSelect={() => {}}
          sx={{ flex: 1, overflowY: "auto" }}
        >
          <Options
            data={data}
            updateItem={updateItem}
            handleToggle={handleToggle}
          />
        </TreeView>
      </div>
    )
  );
};

const Options = ({ data, updateItem, handleToggle }) => {
  const options = data.options;
  const isEnum = data.type === "enum";
  return options.map((option, i) => (
    <Option
      data={option}
      ofEnum={isEnum}
      updateItem={updateItem}
      handleToggle={handleToggle}
    />
  ));
};

const Option = ({ data, ofEnum, updateItem, handleToggle }) => {
  const isHeader = !!data.options;
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateItem(data.id, !data.value, ofEnum);
    handleToggle(data.id);
  };
  return (
    <TreeItem
      nodeId={data.id}
      onClick={handleClick}
      label={
        <FormControlLabel
          label={data.name}
          control={
            ofEnum ? (
              <Radio size="small" checked={!!data.value} onChange={() => {}} />
            ) : (
              <Checkbox
                size="small"
                checked={!!data.value}
                onChange={() => {}}
              />
            )
          }
        />
      }
    >
      {isHeader && (
        <Options
          data={data}
          updateItem={updateItem}
          handleToggle={handleToggle}
        />
      )}
    </TreeItem>
  );
};
