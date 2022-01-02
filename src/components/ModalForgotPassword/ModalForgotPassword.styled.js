import styled from "styled-components";

export const InstructionContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 16px;
	margin-bottom: 24px;
	gap: 6px;
`;

export const DivideContainer = styled.div`
	text-align: center;
	font-size: 12px;
	color: gray;
	display: flex;
	align-items: center;
	width: 124px;
	margin: 0 auto;
	margin-bottom: -16px;
	padding: 16px;
	> span {
		font-size: 1rem;
		font-weight: bold;
		flex: 2 1;
		width: fit-content;
	}
	> hr {
		flex: 1 1;
		background-color: gray;
		border: none;
		height: 1px;
	}
`;
