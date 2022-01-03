import React, { useState } from "react";
import * as Styled from "./ModalSignUp.styled";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { useToggle } from "react-use";
import LoadingButton from "@mui/lab/LoadingButton";
import Checkbox from "@mui/material/Checkbox";
import { InstructionText, HyperlinkText } from "components";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AUTH_VALIDATION } from "constants/validation";
import AuthService from "services/auth.service";
import { useDispatch } from "react-redux";
import { AUTHENTICATION } from "actions/types.action";

const defaultValues = {
	email: "",
	password: "",
	confirmPassword: "",
	name: "",
	studentId: "",
};

export default function ModalSignUp() {
	const [teacher, toggleTeacher] = useToggle(false);
	const [term, toggleTerm] = useToggle(false);
	const history = useHistory();
	const dispatch = useDispatch();
	const [serverError, setServerError] = useState("");
	const [activation, setActivation] = useState("");

	const validationSchema = yup.object().shape({
		email: yup
			.string()
			.trim()
			.email(AUTH_VALIDATION.ERROR_INVALID_EMAIL)
			.required(AUTH_VALIDATION.ERROR_EMAIL_IS_REQUIRED),
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
		name: yup
			.string()
			.trim()
			.required(AUTH_VALIDATION.ERROR_NAME_IS_REQUIRED),
		studentId: !teacher
			? yup
					.string()
					.trim()
					.required(AUTH_VALIDATION.ERROR_STUDENT_ID_IS_REQUIRED)
			: undefined,
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
		setActivation("");
		const response = await AuthService.signUp(data);

		if (response.statusCode) {
			setServerError(
				response.statusCode === AUTH_VALIDATION.CODE_CONFLICT
					? response.message
					: AUTH_VALIDATION.INTERNAL_ERROR
			);
		} else {
			setActivation(
				"Your registration was successful. Please check mail for activation."
			);
			reset(defaultValues);
		}
	};

	return (
		<>
			<Styled.InstructionContainer>
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
			{serverError && (
				<Alert severity="error" sx={{ marginBottom: "24px" }}>
					<Typography color="error">{serverError}</Typography>
				</Alert>
			)}
			{activation && (
				<Alert severity="success" sx={{ marginBottom: "24px" }}>
					<Typography color="success">{activation}</Typography>
				</Alert>
			)}
			<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Styled.ToggleContainer>
					<Stack
						direction="row"
						spacing={1}
						alignItems="center"
						sx={{ width: "fit-content", margin: "0 auto" }}
					>
						<Typography
							sx={{ fontWeight: "bold" }}
							color={teacher ? "lightgrey" : "black"}
						>
							Student
						</Typography>
						<Switch
							color="secondary"
							checked={teacher}
							onChange={toggleTeacher}
						/>
						<Typography
							sx={{ fontWeight: "bold" }}
							color={teacher ? "secondary" : "lightgrey"}
						>
							Teacher
						</Typography>
					</Stack>
				</Styled.ToggleContainer>
				{!teacher && (
					<TextField
						margin="normal"
						id="studentId"
						label="Student ID"
						type="text"
						fullWidth
						variant="outlined"
						{...register("studentId")}
						helperText={errors.studentId?.message}
						error={errors.studentId?.message ? true : false}
					/>
				)}
				<TextField
					margin="normal"
					id="name"
					label="Full Name"
					type="text"
					fullWidth
					variant="outlined"
					{...register("name")}
					helperText={errors.name?.message}
					error={errors.name?.message ? true : false}
				/>
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
				<Stack
					direction="row"
					spacing={1}
					alignItems="center"
					sx={{ marginLeft: "-12px", marginTop: "16px" }}
				>
					<Checkbox
						color="secondary"
						checked={term}
						onChange={toggleTerm}
					/>
					<Styled.InstructionContainer>
						<InstructionText text="I accept all" />
						<HyperlinkText text="Terms and Conditions" />
					</Styled.InstructionContainer>
				</Stack>
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
					disabled={!isValid || !term}
				>
					<Typography variant="h6" sx={{ fontWeight: "bold" }}>
						Sign Up
					</Typography>
				</LoadingButton>
			</form>
		</>
	);
}
