import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Fragment } from "react";
import { useRecoilState } from "recoil";
import { useScores } from "../hooks/disease";
import { diseaseState } from "../recoil/atoms";
async function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}

export default function ResultPage() {
  const [disease, set] = useRecoilState(diseaseState);
  const scores = useScores(disease);

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (_) => {
      // you can use this method to get file and perform respective operations
      const files = Array.from(input.files);
      const file = files[0];
      const object = await parseJsonFile(file);
      console.log(object);
      set(object);
    };
    input.click();
  };

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
      <Box flex={1} />
      <Button onClick={handleUpload}>Upload Diseases</Button>
    </Stack>
  );
}

const DiseaseItem = ({ data }) => {
  return (
    <Fragment>
      <ListItem sx={{ justifyContent: "space-between" }}>
        <ListItemText primary={data.name} />
        <Typography sx={{ textAlign: "end" }}>
          {Math.round(data.score * 100) / 100}
        </Typography>
      </ListItem>
      <Divider />
    </Fragment>
  );
};
