import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Fragment } from "react";
import { useScores } from "../hooks/disease";

export default function ResultPage() {
  const scores = useScores();
  return (
    <Stack overflow="scroll" p={2} gap={2}>
      <Typography variant="h5" fontWeight={700}>
        Result
      </Typography>
      <List>
        {scores?.map((disease, i) => (
          <DiseaseItem key={i} data={disease} />
        ))}
      </List>
    </Stack>
  );
}

const DiseaseItem = ({ data }) => {
  return (
    <Fragment>
      <ListItem sx={{ justifyContent: "space-between" }}>
        <ListItemText>{data.name}</ListItemText>
        <ListItemText sx={{ textAlign: "end" }}>
          {Math.round(data.score * 100) / 100}
        </ListItemText>
      </ListItem>
      <Divider />
    </Fragment>
  );
};
