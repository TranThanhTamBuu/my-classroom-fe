import styled from "styled-components";
import { indigo } from "@mui/material/colors";
import { styled as MUIstyled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

export const TabContainer = styled.div`
	padding: 5;
	display: box;
	gap: 6px;
	padding: 25px 12%;
`;

export const MyContainer = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column-reverse;
	justify-content: space-between;
	padding: 10px;
	background-color: ${indigo[500]};
`;

export const Item = MUIstyled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));
