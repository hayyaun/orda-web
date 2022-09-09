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
import { Fragment, useMemo } from "react";
import { useRecoilState } from "recoil";
import { useData } from "../hooks/data";
import { usePageIndex } from "../hooks/pages";
import { treeState } from "../recoil/atoms";

export default function SimpsPage() {
  const { currPage: data } = usePageIndex();
  const [, , resetData] = useData();
  const [expanded, setExpanded] = useRecoilState(treeState);
  // TODO retrieve expanded items from data filled

  const handleToggle = (id) => {
    setExpanded((s) => {
      let arr = Array.from(s);
      let index = s.indexOf(id);
      if (index < 0) arr.push(id);
      else arr.splice(index, 1);
      return arr;
    });
  };
  const handleReset = () => {
    resetData();
    setExpanded([]);
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
          <Typography variant="h5" fontWeight={700}>
            {data.name}
          </Typography>
        )}
        <Button
          variant="outlined"
          size="small"
          color="error"
          sx={{ ml: 2, mr: 2 }}
          onClick={handleReset}
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
          expanded={expanded}
          selected={[]}
          onNodeSelect={() => {}}
          sx={{ flex: 1, overflowY: "auto" }}
        >
          <List data={data} handleToggle={handleToggle} />
        </TreeView>
      )}
    </Stack>
  );
}

const List = ({ data, handleToggle }) => {
  const options = data.options;
  const isEnum = data.type === "enum";
  return options.map((option, i) => (
    <Item key={i} data={option} ofEnum={isEnum} handleToggle={handleToggle} />
  ));
};

const Item = ({ data: option, ofEnum, handleToggle }) => {
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
    handleToggle(data.id);
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
        <ItemContent data={data} ofEnum={ofEnum} handleToggle={handleToggle} />
      )}
    </TreeItem>
  );
};

const ItemContent = ({ data, ofEnum, handleToggle }) => {
  const [, updateItem] = useData();
  return (
    <Fragment>
      {!!data.desc && <ItemDesc data={data} />}
      {!!data.type && (
        <ItemInput data={data} ofEnum={ofEnum} updateItem={updateItem} />
      )}
      {!!data.options && (
        <List data={data} updateItem={updateItem} handleToggle={handleToggle} />
      )}
    </Fragment>
  );
};

const ItemLabel = ({ data, ofEnum }) => {
  return (
    <FormControlLabel
      label={data.name}
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
            onChange={(e) => updateItem(data.id, data.value, ofEnum)}
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
