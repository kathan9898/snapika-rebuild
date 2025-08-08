import React from "react";
import { Card, Box } from "@mui/material";
import { motion } from "framer-motion";

export default function AnimatedCard({
  children,
  sx = {},
  variant = "elevated",
  className = "",
  ...props
}) {
  const isGlass = variant === "glass";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      <Card
        elevation={isGlass ? 0 : 6}
        className={isGlass ? "glass-card" : undefined}
        sx={{
          borderRadius: 3,
          px: { xs: 2.2, sm: 3 },
          py: { xs: 2.8, sm: 3.4 },
          maxWidth: 560,
          width: "100%",
          mx: "auto",
          ...(isGlass
            ? {
                background: "var(--glass)",
                border: "1px solid var(--glass-brd)",
                backdropFilter: "blur(18px) saturate(160%)",
                boxShadow: "var(--shadow)",
                color: "var(--text)",
              }
            : { bgcolor: "#fff" }),
          ...sx,
        }}
        {...props}
      >
        <Box>{children}</Box>
      </Card>
    </motion.div>
  );
}
