import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import * as Styled from "./Authentication.styled";
import Typography from "@mui/material/Typography";
import {
	ModalSignUp,
	ModalSignIn,
	ModalForgotPassword,
	ModalResetPassword,
} from "components";
import { useSearchParam } from "react-use";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { AUTHENTICATION } from "actions/types.action";

const TAB_NAVIGATION = {
	"sign-in": {
		title: "Sign In",
		Component: ModalSignIn,
	},
	"sign-up": {
		title: "Sign Up",
		Component: ModalSignUp,
	},
	"forgot-password": {
		title: "Forgot Password",
		Component: ModalForgotPassword,
	},
	"reset-password": {
		title: "Reset Password",
		Component: ModalResetPassword,
	},
};

export default function Authentication() {
	const dispatch = useDispatch();
	const authentication = useSelector((state) => state.authentication);
	const tab = useSearchParam("tab");
	const history = useHistory();
	const user = useSelector((state) => state.user);
	const [page, setPage] = useState(
		TAB_NAVIGATION[tab || authentication || "sign-in"]
	);

	useEffect(() => {
		if (tab)
			dispatch({
				type: AUTHENTICATION.SET,
				payload: tab,
			});
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
