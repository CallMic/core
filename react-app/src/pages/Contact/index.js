
import { Box, Paper, Typography } from "@mui/material";

export default function Contact() {
  
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
        <Typography variant="h5">Contact</Typography>
        <br />
        <Typography variant="body1">
          Feel free to contact me at:
          <div>shaul at shauldaon.com</div>
        </Typography>
      </Paper>
      

    </Box>
  );
}
