import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useData } from "./data";

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
