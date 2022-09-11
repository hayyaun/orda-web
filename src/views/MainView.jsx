import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { usePageIndex } from "../hooks/pages";

export default function MainView({ children }) {
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
      sx={{
        height: [
          "calc(var(--vh, 1vh) * 100)",
          "100vh", // Fallback for browsers that do not support Custom Properties
        ],
      }}
    >
      {children}

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
}
