import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AUTH_VALIDATION } from "constants/validation";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ClassesService from "services/classes.service";

let schema = yup.object().shape({
	email: yup
		.string()
		.trim()
		.email(AUTH_VALIDATION.ERROR_INVALID_EMAIL)
		.required(AUTH_VALIDATION.ERROR_EMAIL_IS_REQUIRED),
});

export default function ModalInvite({ open, onClose, id }) {
	// const dispatch = useDispatch();
	const [listEmail, setListEmail] = useState([]);
	const {
		register,
		setValue,
		getValues,
		formState: { isValid, isSubmitting, errors },
	} = useForm({
		mode: "onChange",
		defaultValues: { email: "" },
		resolver: yupResolver(schema),
	});

	const onClickAdd = () => {
		const email = getValues("email");
		setListEmail([...listEmail, email]);
		setValue("email", "");
	};

	const onClickDelete = (email) => {
		const listEmailCopy = listEmail.splice();
		setListEmail(listEmailCopy.filter((e) => e !== email));
	};
	const onClickInvite = async () => {
		const body = {
			classId: id,
			inviteEmail: listEmail.length > 0 ? listEmail : undefined,
		};
		await ClassesService.inviteToClass(body);
		onClose();
	};
	return (
		<Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"sm"}>
			<DialogTitle>Join class</DialogTitle>
			<DialogContent>
				<List>
					{listEmail.map((email) => (
						<ListItem
							key={email}
							secondaryAction={
								<IconButton
									edge="end"
									aria-label="delete"
									onClick={onClickDelete}
								>
									<DeleteIcon />
								</IconButton>
							}
						>
							<ListItemText primary={email} />
						</ListItem>
					))}
				</List>
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
				<Button disabled={!isValid} onClick={onClickAdd}>
					<Typography variant="button">Add</Typography>
				</Button>
				<LoadingButton
					loading={isSubmitting}
					loadingPosition="center"
					variant="button"
					disabled={listEmail.length === 0}
					onClick={onClickInvite}
				>
					<Typography variant="button">Invite</Typography>
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
