import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ResultPage from "./pages/ResultPage";
import SimpsPage from "./pages/SimpsPage";
import MainView from "./views/MainView";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route
            path="/result"
            element={
              <MainView>
                <ResultPage />
              </MainView>
            }
          />
          <Route
            path="/list/:pageIndex"
            element={
              <MainView>
                <SimpsPage />
              </MainView>
            }
          />
          <Route path="*" element={<Navigate to="/list/1" replace />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
