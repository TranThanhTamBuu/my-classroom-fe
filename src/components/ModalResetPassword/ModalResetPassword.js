import React, { useState } from "react";
import * as Styled from "./ModalResetPassword.styled";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { InstructionText, HyperlinkText } from "components";
import { useHistory } from "react-router-dom";
import { AUTH_VALIDATION } from "constants/validation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import AuthService from "services/auth.service";
import { useDispatch } from "react-redux";
import { AUTHENTICATION } from "actions/types.action";
import { useSearchParam } from "react-use";
import Alert from "@mui/material/Alert";
import { yupResolver } from "@hookform/resolvers/yup";

const defaultValues = {
	email: "",
	password: "",
};

export default function ModalSignIn() {
	const history = useHistory();
	const dispatch = useDispatch();
	const [serverError, setServerError] = useState("");
	const [success, setSuccess] = useState("");
	const token = useSearchParam("token");

	const validationSchema = yup.object().shape({
		password: yup
			.string()
			.trim()
			.required(AUTH_VALIDATION.ERROR_PASSWORD_IS_REQUIRED)
			.matches(
				AUTH_VALIDATION.PASSWORD_STRENGTH_REGEX,
				AUTH_VALIDATION.ERROR_PASSWORD_STRENGTH
			),
		confirmPassword: yup
			.string()
			.trim()
			.required(AUTH_VALIDATION.ERROR_REPEAT_PASSWORD_IS_REQUIRED)
			.oneOf(
				[yup.ref("password"), null],
				AUTH_VALIDATION.ERROR_PASSWORD_MATCHED
			),
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
		const response = await AuthService.resetPassword({ ...data, token });
		if (response.statusCode) {
			setServerError(AUTH_VALIDATION.ERROR_EXPIRE_TOKEN);
		} else {
			setSuccess(true);
		}
		reset(defaultValues);
	};

	return (
		<>
			{serverError && (
				<Alert severity="error" sx={{ marginBottom: "24px" }}>
					<Typography color="error">{serverError}</Typography>
				</Alert>
			)}
			{success && (
				<Alert severity="success" sx={{ marginBottom: "24px" }}>
					<Typography color="success">
						Your account password has been reset successfully.
					</Typography>
				</Alert>
			)}
			<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
				<TextField
					margin="normal"
					id="room"
					label="Confirm Password"
					type="password"
					fullWidth
					variant="outlined"
					{...register("confirmPassword")}
					helperText={errors.confirmPassword?.message}
					error={errors.confirmPassword?.message ? true : false}
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
						Reset
					</Typography>
				</LoadingButton>
			</form>
			<Styled.InstructionContainer style={{ marginBottom: "0px" }}>
				<InstructionText text="Reset password successfully?" />
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
