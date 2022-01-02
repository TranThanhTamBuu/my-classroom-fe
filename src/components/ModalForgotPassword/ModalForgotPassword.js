import React, { useState } from "react";
import * as Styled from "./ModalForgotPassword.styled";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import { InstructionText, HyperlinkText } from "components";
import { useHistory } from "react-router-dom";
import { AUTH_VALIDATION } from "constants/validation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "services/auth.service";
import { useDispatch } from "react-redux";
import { AUTHENTICATION } from "actions/types.action";

const defaultValues = {
	email: "",
};

export default function ModalSignIn() {
	const history = useHistory();
	const dispatch = useDispatch();
	const [serverError, setServerError] = useState("");
	const [success, setSuccess] = useState(false);

	const validationSchema = yup.object().shape({
		email: yup
			.string()
			.trim()
			.email(AUTH_VALIDATION.ERROR_INVALID_EMAIL)
			.required(AUTH_VALIDATION.ERROR_EMAIL_IS_REQUIRED),
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { isValid, isSubmitting, errors },
	} = useForm({
		mode: "onTouched",
		reValidateMode: "onChange",
		defaultValues,
		resolver: yupResolver(validationSchema),
	});

	const onSubmit = async (data) => {
		setServerError("");
		setSuccess(false);

		const response = await AuthService.forgotPassword(data);
		if (response.statusCode) {
			setServerError("This email has not been registered yet.");
		} else {
			setSuccess(true);
		}

		reset(defaultValues);
	};

	return (
		<>
			<Styled.InstructionContainer>
				<InstructionText text="Enter your email below to receive your password reset instructions." />
			</Styled.InstructionContainer>
			{serverError && (
				<Alert severity="error" sx={{ marginBottom: "24px" }}>
					<Typography color="error">{serverError}</Typography>
				</Alert>
			)}
			{success && (
				<Alert severity="success" sx={{ marginBottom: "24px" }}>
					<Typography color="success">
						Your account has been activated successfully.
					</Typography>
				</Alert>
			)}
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
						Send
					</Typography>
				</LoadingButton>
			</form>
			<Styled.InstructionContainer style={{ marginBottom: "0px" }}>
				<InstructionText text="Already have an account?" />
				<HyperlinkText
					text="Sign in"
					onClick={() => {
						history.push("/?tab=sign-in");
						dispatch({
							type: AUTHENTICATION.SET,
							payload: "sign-in",
						});
					}}
				/>
			</Styled.InstructionContainer>
		</>
	);
}
