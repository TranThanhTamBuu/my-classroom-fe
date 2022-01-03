import { styled as MUIStyled } from "@mui/material/styles";
import BaseBadge from "@mui/material/Badge";

export const Badge = MUIStyled(BaseBadge)(({ theme }) => ({
	"& .MuiBadge-badge": {
		lineHeight: "20px",
		transform: "scale(0.8) translate(50%, -50%)",
		backgroundColor: theme.palette.secondary,
		color: theme.palette.secondary,
		"&::after": {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			borderRadius: "100%",
			animation: "ripple 1.2s infinite ease-in-out",
			border: "1px solid currentColor",
			content: '""',
		},
	},
	"@keyframes ripple": {
		"0%": {
			transform: "scale(.8)",
			opacity: 1,
		},
		"100%": {
			transform: "scale(2.4)",
			opacity: 0,
		},
	},
}));
