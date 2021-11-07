import React from "react";
import { styled as styledMUI } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const InstructionText = styledMUI(({ text, ...props }) => (
	<Typography {...props} variant="subtitle1" align="center" color="gray">
		{text}
	</Typography>
))({
	fontWeight: "bold",
	width: "fit-content",
});
