import styled from "styled-components";
import { styled as styledMUI, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { indigo } from "@mui/material/colors";

export const MyContainer = styled.div`
	height: 100vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
`;

export const Spacer = styled.div`
	height: 16px;
`;

export const RightContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 16px;
	width: 60%;
`;

export const SearchIconWrapper = styledMUI("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

export const Search = styledMUI("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(indigo[100], 0.15),
	"&:hover": {
		backgroundColor: alpha(indigo[100], 0.25),
	},
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(1),
		width: "auto",
	},
}));

export const StyledInputBase = styledMUI(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			width: "12ch",
			"&:focus": {
				width: "20ch",
			},
		},
	},
}));
