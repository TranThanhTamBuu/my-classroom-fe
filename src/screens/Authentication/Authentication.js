import React, { useEffect } from "react";
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
		component: ModalSignIn,
	},
	"sign-up": {
		title: "Sign Up",
		component: ModalSignUp,
	},
};

export default function Authentication() {
	const history = useHistory();
	const user = useSelector((state) => state.user);

	useEffect(() => {
		if (user) return history.push("/classes");
	}, [user]);

	const tab = useSearchParam("tab");

	const { title, component: Component } = TAB_NAVIGATION[tab || "sign-in"];

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
					{title}
				</Typography>
				<Component />
			</Paper>
		</Styled.MyContainer>
	);
}
