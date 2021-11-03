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

import { useDispatch } from "react-redux";
import { pushClasses } from "actions/classes.action";

let schema = yup.object().shape({
	name: yup.string().trim().required(),
	section: yup.string().trim(),
	subject: yup.string().trim(),
	room: yup.string().trim(),
});

export default function ModalCreateClass({ open, onClose }) {
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data) => {
		dispatch(pushClasses(data));
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Create class</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Class name (required)"
						type="text"
						fullWidth
						variant="filled"
						{...register("name")}
					/>
					<TextField
						margin="dense"
						id="section"
						label="Section"
						type="text"
						fullWidth
						variant="filled"
						{...register("section")}
					/>
					<TextField
						margin="dense"
						id="subject"
						label="Subject"
						type="text"
						fullWidth
						variant="filled"
						{...register("subject")}
					/>
					<TextField
						margin="dense"
						id="room"
						label="Room"
						type="text"
						fullWidth
						variant="filled"
						{...register("room")}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>
						<Typography variant="button">Cancel</Typography>
					</Button>
					<Button type="submit" disabled={!isValid}>
						<Typography variant="button">Create</Typography>
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
