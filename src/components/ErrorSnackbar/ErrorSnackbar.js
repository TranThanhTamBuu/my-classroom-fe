import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { removeSnackbar } from "../../actions/snackbar.action";

export default function ErrorSnackbar() {
	const dispatch = useDispatch();
	const snackbarOpen = useSelector((state) => state.snackbar.open);
	const snackbarMessage = useSelector((state) => state.snackbar.message);
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		dispatch(removeSnackbar(snackbarMessage));
	};

	return (
		<Snackbar
			open={snackbarOpen}
			autoHideDuration={3000}
			onClose={handleClose}
		>
			<MuiAlert
				elevation={6}
				variant="filled"
				onClose={handleClose}
				severity="error"
			>
				{snackbarMessage}
			</MuiAlert>
		</Snackbar>
	);
}
