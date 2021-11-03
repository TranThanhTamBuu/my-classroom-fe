import React from "react";
import { styled as styledMUI } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

export const MyTooltip = styledMUI(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))({
	[`& .${tooltipClasses.tooltip}`]: {
		maxWidth: "none",
	},
});
