import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AUTH_VALIDATION } from "constants/validation";
import AuthService from "services/auth.service";
import LoadingButton from "@mui/lab/LoadingButton";

import Alert from "@mui/material/Alert";

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
	name: yup.string().trim().required(AUTH_VALIDATION.ERROR_NAME_IS_REQUIRED),
});

const defaultValues = {
	email: "",
	password: "",
	confirmPassword: "",
	name: "",
};

export default function ModalCreateAdmin({ open, onClose }) {
	const [serverError, setServerError] = useState("");
	const {
		register,
		handleSubmit,
		reset,
		formState: { isValid, errors, isSubmitting },
	} = useForm({
		mode: "onTouched",
		reValidateMode: "onChange",
		resolver: yupResolver(validationSchema),
		defaultValues,
	});

	const onSubmit = async (data) => {
		const response = await AuthService.createAdmin({
			...data,
			isAdmin: true,
		});
		if (response.statusCode) {
			setServerError(
				response.statusCode === AUTH_VALIDATION.CODE_CONFLICT
					? response.message
					: AUTH_VALIDATION.INTERNAL_ERROR
			);
		} else handleClose();
	};

	const handleClose = () => {
		reset(defaultValues);
		setServerError("");
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Create admin</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				{serverError && (
					<Alert severity="error" sx={{ marginBottom: "24px" }}>
						<Typography color="error">{serverError}</Typography>
					</Alert>
				)}
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Name"
						type="text"
						fullWidth
						variant="filled"
						{...register("name")}
						helperText={errors.name?.message}
						error={errors.name?.message ? true : false}
					/>
					<TextField
						margin="dense"
						id="section"
						label="Email"
						type="email"
						fullWidth
						variant="filled"
						{...register("email")}
						helperText={errors.email?.message}
						error={errors.email?.message ? true : false}
					/>
					<TextField
						margin="dense"
						id="subject"
						label="Password"
						type="password"
						fullWidth
						variant="filled"
						{...register("password")}
						helperText={errors.password?.message}
						error={errors.password?.message ? true : false}
					/>
					<TextField
						margin="dense"
						id="room"
						label="Confirm Password"
						type="password"
						fullWidth
						variant="filled"
						{...register("confirmPassword")}
						helperText={errors.confirmPassword?.message}
						error={errors.confirmPassword?.message ? true : false}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>
						<Typography variant="button">Cancel</Typography>
					</Button>
					<LoadingButton
						loading={isSubmitting}
						loadingPosition="center"
						type="submit"
						disabled={!isValid}
					>
						<Typography variant="button">Create</Typography>
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}
