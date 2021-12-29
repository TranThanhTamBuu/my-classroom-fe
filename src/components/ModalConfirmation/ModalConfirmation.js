import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

export default function ModalConfirmation({ open, onClose, onOk, loading }) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					This action cant not be undone. Please consider clearly
					before continuing.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<LoadingButton
					onClick={onOk}
					autoFocus
					loading={loading}
					loadingPosition="center"
				>
					Ok
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
