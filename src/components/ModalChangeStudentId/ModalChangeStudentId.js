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
	studentId: yup
		.string()
		.trim()
		.required(AUTH_VALIDATION.ERROR_STUDENT_ID_IS_REQUIRED),
});

const defaultValues = {
	studentId: "",
};

export default function ModalChangeStudentId({ open, onClose, userId }) {
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
		const response = await AuthService.changeStudentId({
			...data,
			userId,
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
			<DialogTitle>Change student Id</DialogTitle>
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
						id="studentId"
						label="Change student Id to"
						type="text"
						fullWidth
						variant="filled"
						{...register("studentId")}
						helperText={errors.studentId?.message}
						error={errors.studentId?.message ? true : false}
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
						<Typography variant="button">Change</Typography>
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}
