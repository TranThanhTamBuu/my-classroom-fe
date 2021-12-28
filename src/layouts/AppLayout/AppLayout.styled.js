import styled from "styled-components";
import Container from "@mui/material/Container";
import { styled as styledMUI } from "@mui/material/styles";

export const Wrapper = styled.div`
	width: 100%;
`;

export const MyContainer = styledMUI(Container)`
	width: 100%;
	margin-top: 40px;
	min-height: calc(100vh - 104px);
`;
