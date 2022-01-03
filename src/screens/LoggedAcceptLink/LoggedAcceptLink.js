import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import ClassesService from "services/classes.service";
import Button from "@mui/material/Button";
import { showSnackbar } from "actions/snackbar.action";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoggedAcceptLink() {
	const [emailValidForLink, setEmailValidForLink] = useState(false);
	const [loading, setLoading] = useState(true);
	const history = useHistory();
	const user = useSelector((state) => state.user);
	const token = useParams();
	const dispatch = useDispatch();
	useEffect(() => {
		if (!user) {
			history.push("/");
		}
	}, [user]);

	useEffect(() => {
		async function checkEmailValid() {
			let data = await ClassesService.checkJoinLinkValid(token.token);
			if (data.success && data.isAccepted) {
				await onClickJoinClass();
			}
			setEmailValidForLink(data.success && data.isAccepted);
			setLoading(false);
		}
		checkEmailValid();
	}, []);

	const onClickJoinClass = async function () {
		try {
			let data = await ClassesService.joinClass({ linkId: token.token });
			if (data.success) {
				const classId = data.classId.toString();
				history.push("/class/" + classId);
			}
		} catch (err) {
			dispatch(showSnackbar(String(err)));
		}
	};
	const onClickFailedToJoin = async function () {
		history.push("/");
	};

	if (loading) {
		return (
			<Backdrop
				sx={{
					color: "#fff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={loading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		);
	} else {
		return (
			<>
				<Dialog
					open={true}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{"Your email is not invited to join this class"}
					</DialogTitle>
					<DialogActions>
						<Button onClick={onClickFailedToJoin} autoFocus>
							OK
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	}
}
