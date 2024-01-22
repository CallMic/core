import React from "react";
import UploadFile from "../../components/UploadFile";
import { Box, Paper, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ flexGrow: 1 }} spacing={10}>
      <Paper
        elevation={3}
        sx={{
          width: "800px",
          margin: "0 auto",
          padding: (theme) => theme.spacing(3, 5),          
        }}
      >
        <Typography variant="h5">Just upload your call audio file and instantly receive detailed analytics.</Typography>
        <br />
        <Typography variant="body1">
          Learn which words and phrases you use a lot, which you don't, and improve your sales calls, interviews, or whatever it is.
        </Typography>
      </Paper>
      
      <Paper
        elevation={3}
        sx={{
          width: "800px",
          margin: "0 auto",
          padding: (theme) => theme.spacing(3, 5),
        }}
      >
      <UploadFile></UploadFile>
      </Paper>
    </Box>
  );
}
