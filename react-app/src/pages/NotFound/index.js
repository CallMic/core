
import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function Orders() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper elevation={3} sx={{ padding: (theme) => theme.spacing(3, 2) }}>
        <Typography component="p">Page not found</Typography>
      </Paper>
    </Box>
  );
}
