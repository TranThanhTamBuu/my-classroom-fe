import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import * as Styled from "./Authentication.styled";
import Typography from "@mui/material/Typography";
import { ModalSignUp, ModalSignIn } from "components";
import { useSearchParam } from "react-use";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

const TAB_NAVIGATION = {
	"sign-in": {
		title: "Sign In",
		Component: ModalSignIn,
	},
	"sign-up": {
		title: "Sign Up",
		Component: ModalSignUp,
	},
};

export default function Authentication() {
	const authentication = useSelector((state) => state.authentication);
	const tab = useSearchParam("tab");
	const history = useHistory();
	const user = useSelector((state) => state.user);
	const [page, setPage] = useState(
		TAB_NAVIGATION[authentication || "sign-in"]
	);

	useEffect(() => {
		setPage(TAB_NAVIGATION[tab || "sign-in"]);
	}, []);

	useEffect(() => {
		setPage(TAB_NAVIGATION[authentication]);
	}, [authentication]);

	useEffect(() => {
		if (user) return history.push("/classes");
	}, [user]);

	return (
		<Styled.MyContainer>
			<Paper
				sx={{
					width: "560px",
					margin: "auto",
					padding: "40px 56px",
					borderRadius: "8px",
				}}
				elevation={3}
			>
				<Typography
					variant="h4"
					align="center"
					sx={{ fontWeight: "bold" }}
					gutterBottom
				>
					{page.title}
				</Typography>
				<page.Component />
			</Paper>
		</Styled.MyContainer>
	);
}
