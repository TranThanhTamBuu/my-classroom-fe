import React, { useState, useEffect } from "react";
import * as Styled from "./ModalSignIn.styled";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { InstructionText, HyperlinkText } from "components";
import { useHistory } from "react-router-dom";
import { AUTH_VALIDATION } from "constants/validation";
import { LOCAL_STORAGE_KEY } from "constants/localStorage";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "services/auth.service";
import { useDispatch } from "react-redux";
import { initUser } from "actions/user.action";
import { popupCenter } from "utils/popup.utils";

export default function ModalSignUp() {
	const history = useHistory();
	const dispatch = useDispatch();
	const [serverError, setServerError] = useState("");
	const [reload, setReload] = useState(false);

	useEffect(() => {
		if (reload) window.location.reload();
	}, [reload]);

	const validationSchema = yup.object().shape({
		email: yup
			.string()
			.trim()
			.email(AUTH_VALIDATION.ERROR_INVALID_EMAIL)
			.required(AUTH_VALIDATION.ERROR_EMAIL_IS_REQUIRED),
		password: yup
			.string()
			.trim()
			.required(AUTH_VALIDATION.ERROR_PASSWORD_IS_REQUIRED),
	});

	const {
		register,
		handleSubmit,
		formState: { isValid, isSubmitting, errors },
	} = useForm({
		mode: "onTouched",
		reValidateMode: "onChange",
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: yupResolver(validationSchema),
	});

	const onSubmit = async (data) => {
		const response = await AuthService.signIn(data);
		if (response.statusCode) {
			setServerError(
				response.statusCode === AUTH_VALIDATION.CODE_UNAUTHORIZED
					? AUTH_VALIDATION.ERROR_SIGN_IN_FAILED
					: AUTH_VALIDATION.INTERNAL_ERROR
			);
		} else {
			localStorage.setItem(
				LOCAL_STORAGE_KEY.ACCESS_TOKEN,
				response.accessToken
			);
			dispatch(initUser());
		}
	};

	const handleThirdPartyResponse = async (popupWindow) => {
		let timer = null;
		if (popupWindow) {
			// eslint-disable-next-line no-undef
			timer = setInterval(() => {
				if (popupWindow.closed) {
					// eslint-disable-next-line no-undef
					timer && clearInterval(timer);
					if (localStorage.getItem(LOCAL_STORAGE_KEY.STATUS_CODE))
						setServerError(
							AUTH_VALIDATION.ERROR_THIRD_PARTY_CREDENTIAL
						);
					else if (
						localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
					) {
						setReload(true);
					}
				}
			}, 500);
		}
	};

	const handleGoogleLogin = async () => {
		const googleLoginURL = `${process.env.REACT_APP_BE_URL}/auth/google`;
		const loginWithGoogleWindows = popupCenter({
			url: googleLoginURL,
			w: 500,
			h: 600,
		});

		await handleThirdPartyResponse(loginWithGoogleWindows);
	};

	const handleMicrosoftLogin = async () => {
		const microsoftLoginURL = `${process.env.REACT_APP_BE_URL}/auth/microsoft`;
		const loginWithMicrosoftWindows = popupCenter({
			url: microsoftLoginURL,
			w: 500,
			h: 600,
		});

		await handleThirdPartyResponse(loginWithMicrosoftWindows);
	};

	return (
		<>
			<Styled.InstructionContainer>
				<InstructionText text="Don’t have an account yet?" />
				<HyperlinkText
					text="Sign up"
					onClick={() => history.push("/?tab=sign-up")}
				/>
			</Styled.InstructionContainer>
			{serverError && (
				<Alert severity="error" sx={{ marginBottom: "24px" }}>
					<Typography color="error">{serverError}</Typography>
				</Alert>
			)}
			<Button
				onClick={handleGoogleLogin}
				startIcon={
					<img
						src={process.env.PUBLIC_URL + "/icon/google.svg"}
						alt="google"
					/>
				}
				variant="outlined"
				size="large"
				sx={{
					width: "100%",
					textTransform: "none",
					fontWeight: "bold",
				}}
			>
				Sign In with Google
			</Button>
			<Button
				onClick={handleMicrosoftLogin}
				startIcon={
					<img
						src={process.env.PUBLIC_URL + "/icon/microsoft.svg"}
						alt="microsoft"
					/>
				}
				variant="outlined"
				size="large"
				sx={{
					width: "100%",
					marginTop: "16px",
					textTransform: "none",
					fontWeight: "bold",
				}}
			>
				Sign In with Microsoft
			</Button>
			<Styled.DivideContainer>
				<hr />
				<span>Or</span>
				<hr />
			</Styled.DivideContainer>
			<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<TextField
					margin="normal"
					id="section"
					label=" Email"
					type="email"
					fullWidth
					variant="outlined"
					{...register("email")}
					helperText={errors.email?.message}
					error={errors.email?.message ? true : false}
				/>
				<TextField
					margin="normal"
					id="subject"
					label="Password"
					type="password"
					fullWidth
					variant="outlined"
					{...register("password")}
					helperText={errors.password?.message}
					error={errors.password?.message ? true : false}
				/>
				<LoadingButton
					color="primary"
					type="submit"
					loading={isSubmitting}
					loadingPosition="center"
					variant="contained"
					size="large"
					sx={{
						width: "100%",
						marginTop: "16px",
					}}
					disabled={!isValid}
				>
					<Typography variant="h6" sx={{ fontWeight: "bold" }}>
						Sign In
					</Typography>
				</LoadingButton>
			</form>
		</>
	);
}
