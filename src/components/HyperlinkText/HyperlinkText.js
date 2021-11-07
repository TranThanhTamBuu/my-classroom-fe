import React from "react";
import { styled as styledMUI } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const HyperlinkText = styledMUI(({ text, ...props }) => (
	<Typography {...props} variant="subtitle1" align="center" color="secondary">
		{text}
	</Typography>
))({
	fontWeight: "bold",
	textDecoration: "underline",
	cursor: "pointer",
	width: "fit-content",
});
