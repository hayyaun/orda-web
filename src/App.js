import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { RecoilRoot } from "recoil";
import { useData } from "./hooks/data";

function App() {
  return (
    <RecoilRoot>
      <SimpsPage />
    </RecoilRoot>
  );
}

export default App;

const SimpsPage = () => {
  const [pages] = useData();
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

  return (
    <Stack flex={1} gap={2} justifyContent="space-between" alignItems="stretch">
      <PageContent data={currPage} />
      <Stack
        direction="row"
        gap={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack
          direction="row"
          width={80}
          alignItems="center"
          sx={{ cursor: canGoBack ? "pointer" : "initial" }}
          onClick={handlePrev}
        >
          <IconButton
            flex={1}
            variant="contained"
            disabled={!canGoBack}
            color="primary"
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography
            variant="caption"
            textTransform="uppercase"
            color={canGoBack ? "primary" : "#666"}
          >
            Previous
          </Typography>
        </Stack>
        <Typography textTransform="uppercase" variant="subtitle2">
          {pageIndex + 1}
        </Typography>
        <Stack
          direction="row"
          width={80}
          alignItems="center"
          sx={{ cursor: canGoForward ? "pointer" : "initial" }}
          onClick={handleNext}
        >
          <Typography
            variant="caption"
            textTransform="uppercase"
            color={canGoForward ? "primary" : "#666"}
          >
            Next
          </Typography>
          <IconButton
            variant="contained"
            disabled={!canGoForward}
            color="primary"
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

const PageContent = ({ data }) => {
  const [, , resetData] = useData();
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
      <Stack gap={4} flex={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          pt={2}
          pl={4}
        >
          <Typography variant="h5" fontWeight={700}>
            {data.name}
          </Typography>
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
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          selected={[]}
          onNodeSelect={() => {}}
          sx={{ flex: 1, overflowY: "auto" }}
        >
          <Options data={data} handleToggle={handleToggle} />
        </TreeView>
      </Stack>
    )
  );
};

const Options = ({ data, handleToggle }) => {
  const options = data.options;
  const isEnum = data.type === "enum";
  return options.map((option, i) => (
    <Option data={option} ofEnum={isEnum} handleToggle={handleToggle} />
  ));
};

const Option = ({ data, ofEnum, handleToggle }) => {
  const [, updateItem] = useData();
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
