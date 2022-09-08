import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Fragment, useMemo, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import { useData } from "./hooks/data";
import { useScores } from "./hooks/disease";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/result" element={<ResultPage />} />
          <Route path="/list/:pageIndex" element={<SimpsPage />} />
          <Route path="*" element={<Navigate to="/list/1" replace />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;

export function usePageIndex() {
  const nav = useNavigate();
  const { pageIndex: pi } = useParams();
  const location = useLocation();

  const pageIndex = useMemo(() => parseInt(pi || 1) - 1, [pi]);
  const [data] = useData();
  const pages = useMemo(() => data.filter((i) => i.page), [data]);
  const currPage = Array.isArray(pages) ? pages[pageIndex] : null;

  const isResult = location.pathname === "/result";
  const canGoBack = pageIndex > 0 || isResult;
  const canGoForward = !isResult && pageIndex < pages?.length - 1;

  const handlePrev = () => {
    if (canGoBack) nav("/list/" + (!isResult ? pageIndex : pages?.length));
  };
  const handleNext = () => {
    if (canGoForward) nav("/list/" + (pageIndex + 2));
  };
  const handleResult = () => {
    nav("/result");
  };

  return {
    isResult,
    pageIndex,
    currPage,
    canGoBack,
    canGoForward,
    handlePrev,
    handleNext,
    handleResult,
  };
}

const MainView = ({ PageComponent }) => {
  const {
    isResult,
    pageIndex,
    canGoBack,
    canGoForward,
    handlePrev,
    handleNext,
    handleResult,
  } = usePageIndex();

  return (
    <Stack
      overflow="hidden"
      flex={1}
      gap={2}
      justifyContent="space-between"
      alignItems="stretch"
    >
      {PageComponent}

      <Stack
        direction="row"
        gap={1}
        justifyContent="space-between"
        alignItems="center"
      >
        {canGoBack ? (
          <Stack
            direction="row"
            width={80}
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={handlePrev}
          >
            <IconButton flex={1} variant="contained" color="primary">
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
        ) : (
          <Box width={90} />
        )}
        <Typography textTransform="uppercase" variant="subtitle2">
          {isResult ? "Result" : pageIndex + 1}
        </Typography>
        {!isResult ? (
          <Stack
            direction="row"
            width={90}
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={canGoForward ? handleNext : handleResult}
          >
            <Typography
              variant="caption"
              textTransform="uppercase"
              color={canGoForward ? "primary" : "green"}
            >
              {canGoForward ? "Next" : "Result"}
            </Typography>
            <IconButton
              variant="contained"
              color={canGoForward ? "primary" : "success"}
            >
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        ) : (
          <Box width={90} />
        )}
      </Stack>
    </Stack>
  );
};

const ResultPage = () => {
  const scores = useScores();
  return (
    <MainView
      PageComponent={
        <Stack overflow="scroll">
          <Typography variant="h5" fontWeight={700}>
            Result
          </Typography>
          {scores?.map((disease, i) => (
            <div key={i}>{disease.name + " : " + disease.score}</div>
          ))}
        </Stack>
      }
    />
  );
};

const SimpsPage = () => {
  const { currPage: data } = usePageIndex();
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
    <MainView
      PageComponent={
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
              expanded={expanded}
              selected={[]}
              onNodeSelect={() => {}}
              sx={{ flex: 1, overflowY: "auto" }}
            >
              <List data={data} handleToggle={handleToggle} />
            </TreeView>
          )}
        </Stack>
      }
    />
  );
};

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
