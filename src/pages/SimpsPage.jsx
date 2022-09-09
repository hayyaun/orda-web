import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Fragment, useMemo, useState } from "react";
import { useData } from "../hooks/data";
import { usePageIndex } from "../hooks/pages";

export default function SimpsPage() {
  const { currPage: data } = usePageIndex();
  const [allData, , resetData] = useData();
  const [expanded, setExpanded] = useState([]);

  const valued = useMemo(() => {
    const expSet = new Set();
    allData.forEach((i) => {
      if (i.value) expSet.add(i.id);
      if (Array.isArray(i.options)) {
        i.options.forEach((o) => {
          if (o.value) expSet.add(o.id);
        });
      }
    });
    console.log(expSet);
    return Array.from(expSet);
  }, [allData]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  return (
    <Stack gap={4} flex={1} overflow="scroll">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pt={2}
        pl={4}
      >
        {data && (
          <Stack>
            <Typography variant="h5" fontWeight={700}>
              {data.name}
            </Typography>
            <Typography variant="subtitle2" fontWeight={500} color="#444">
              {data.desc}
            </Typography>
          </Stack>
        )}
        <Button
          variant="outlined"
          size="small"
          color="error"
          sx={{ ml: 2, mr: 2 }}
          onClick={resetData}
        >
          <Typography
            variant="caption"
            textTransform="uppercase"
            sx={{ cursor: "pointer" }}
          >
            Reset
          </Typography>
        </Button>
      </Stack>
      {data && (
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={[...expanded, ...valued]}
          selected={[]}
          onNodeSelect={() => {}}
          onNodeToggle={handleToggle}
          sx={{ flex: 1, overflowY: "auto" }}
        >
          <OptionsList data={data} />
        </TreeView>
      )}
    </Stack>
  );
}

const OptionsList = ({ data }) => {
  const options = data.options;
  const isEnum = data.type === "enum";
  return options.map((option, i) => (
    <Item key={i} data={option} ofEnum={isEnum} />
  ));
};

const Item = ({ data: option, ofEnum }) => {
  const [allData, updateItem] = useData();
  const data = useMemo(() => {
    if (typeof option === "string") return allData.find((i) => i.id === option);
    else return option;
  }, [allData, option]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!data.type || data.type === "enum")
      updateItem(data.id, !data.value, ofEnum);
  };

  // console.log(data.id, data);

  return (
    <TreeItem
      nodeId={data.id}
      onClick={handleClick}
      defaultChecked={!!data.value}
      label={<ItemLabel data={data} ofEnum={ofEnum} />}
    >
      {(!!data.desc || !!data.type || !!data.options) && (
        <ItemContent data={data} ofEnum={ofEnum} />
      )}
    </TreeItem>
  );
};

const ItemContent = ({ data, ofEnum }) => {
  const [, updateItem] = useData();
  return (
    <Fragment>
      {!!data.desc && <ItemDesc data={data} />}
      {!!data.type && (
        <ItemInput data={data} ofEnum={ofEnum} updateItem={updateItem} />
      )}
      {!!data.options && <OptionsList data={data} updateItem={updateItem} />}
    </Fragment>
  );
};

const ItemLabel = ({ data, ofEnum }) => {
  return (
    <FormControlLabel
      label={
        <Typography sx={{ display: "flex", gap: 1 }}>
          {data.name}{" "}
          <span style={{ color: data.required ? "error.main" : "text.main" }}>
            {data.required ? "*" : ""}
          </span>
        </Typography>
      }
      control={
        ofEnum ? (
          <Radio size="small" checked={!!data.value} onChange={() => {}} />
        ) : (
          <Checkbox size="small" checked={!!data.value} onChange={() => {}} />
        )
      }
    />
  );
};

const ItemDesc = ({ data }) => {
  return (
    <Stack p={2}>
      {typeof data.desc === "string" ? (
        <div>{data.desc}</div>
      ) : (
        <div>
          <div>{data.desc.title}</div>
          <img alt={data.desc.title} src={data.desc.image} />
        </div>
      )}
    </Stack>
  );
};

const ItemInput = ({ data, ofEnum, updateItem }) => {
  return (
    data.type &&
    data.type !== "enum" && (
      <Stack p={2}>
        {data.type === "string" ? (
          <TextField
            size="small"
            type="text"
            placeholder={data.name}
            value={data.value}
            onChange={(e) => updateItem(data.id, e.target.value, ofEnum)}
          />
        ) : data.type === "number" ? (
          <TextField
            size="small"
            type="number"
            placeholder={data.name}
            value={data.value}
            onChange={(e) => updateItem(data.id, e.target.value, ofEnum)}
          />
        ) : data.type === "range" ? (
          <Stack direction="row" gap={1}>
            <TextField
              size="small"
              type="number"
              placeholder="Start"
              value={data.value?.a}
              onChange={(e) =>
                updateItem(
                  data.id,
                  { a: e.target.value, b: data.value?.b },
                  ofEnum
                )
              }
            />
            <TextField
              size="small"
              type="number"
              placeholder="End"
              value={data.value?.b}
              onChange={(e) =>
                updateItem(
                  data.id,
                  { a: data.value?.a, b: e.target.value },
                  ofEnum
                )
              }
            />
          </Stack>
        ) : null}
      </Stack>
    )
  );
};
