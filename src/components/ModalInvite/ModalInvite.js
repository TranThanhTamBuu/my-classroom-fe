import React from "react";
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
import LoadingButton from "@mui/lab/LoadingButton";

let schema = yup.object().shape({
	email: yup
		.string()
		.trim()
		.email(AUTH_VALIDATION.ERROR_INVALID_EMAIL)
		.required(AUTH_VALIDATION.ERROR_EMAIL_IS_REQUIRED),
});

export default function ModalInvite({ open, onClose }) {
	// const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { isValid, isSubmitting, errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data) => {
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"sm"}>
			<DialogTitle>Join class</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="classCode"
						label="Email"
						type="text"
						fullWidth
						variant="filled"
						{...register("email")}
						helperText={errors.email?.message}
						error={errors.email?.message ? true : false}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>
						<Typography variant="button">Cancel</Typography>
					</Button>
					<LoadingButton
						type="submit"
						loading={isSubmitting}
						loadingPosition="center"
						variant="button"
						disabled={!isValid}
					>
						Invite
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}
