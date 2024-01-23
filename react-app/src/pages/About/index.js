import { Box, Paper, Typography } from "@mui/material";

export default function About() {
  return (
    <Box sx={{ flexGrow: 1 }}>

      <Paper
        elevation={3}
        sx={{
          width: "800px",
          margin: "0 auto",
          padding: (theme) => theme.spacing(3, 5),          
        }}
      >
        <Typography variant="h5">About</Typography>
        <br />
        <Typography variant="body1">
          This small utility website was programmed by Shaul Daon (2024).
          <div>Feel free to use it, it's free.</div>          
        </Typography>
      </Paper>
      

    </Box>
  );
}
