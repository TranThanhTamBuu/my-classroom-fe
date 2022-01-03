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
import ClassesService from "services/classes.service";
import { setClasses } from "actions/classes.action";
import { useDispatch } from "react-redux";
import { showSnackbar } from "actions/snackbar.action";

let schema = yup.object().shape({
	classCode: yup.string().trim().required(),
});

export default function ModalJoinClass({ open, onClose }) {
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		getValues,
		formState: { isValid },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data) => {
		// gg8zWRMs
		ClassesService.joinByCode(getValues("classCode"))
			.then(() => {
				dispatch(setClasses());
			})
			.catch((err) => {
				dispatch(showSnackbar(String(err)));
			})
			.finally(() => {
				onClose();
				window.location.reload(false);
			});
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
						label="Class Code (required)"
						type="text"
						fullWidth
						variant="filled"
						{...register("classCode")}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>
						<Typography variant="button">Cancel</Typography>
					</Button>
					<Button type="submit" disabled={!isValid}>
						<Typography variant="button">Join</Typography>
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
