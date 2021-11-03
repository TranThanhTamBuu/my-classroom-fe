import styled from "styled-components";
import { indigo } from "@mui/material/colors";

export const TitleContainer = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
`;

export const HeaderWrapper = styled.div`
	position: absolute;
	padding: 16px;
	top: 0;
	left: 0;
	height: 33%;
	width: 100%;
	background-color: ${indigo[500]};
`;

export const MyContainer = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;
