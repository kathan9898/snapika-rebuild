import React from "react";
import { Card, Box } from "@mui/material";
import { motion } from "framer-motion";

export default function AnimatedCard({ children, sx = {}, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card
        elevation={8}
        sx={{
          borderRadius: 5,
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 5 },
          maxWidth: 420,
          width: "100%",
          mx: "auto",
          bgcolor: "#fff",
          ...sx,
        }}
        {...props}
      >
        <Box>{children}</Box>
      </Card>
    </motion.div>
  );
}
