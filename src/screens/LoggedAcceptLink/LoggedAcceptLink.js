import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import ClassesService from "services/classes.service";
import Button from "@mui/material/Button";

export default function LoggedAcceptLink() {
	const [emailValidForLink, setEmailValidForLink] = useState(false);
	const history = useHistory();
	const user = useSelector((state) => state.user);
	const token = useParams();

	useEffect(() => {
		if (!user) {
			history.push("/");
		}
	}, [user]);

	useEffect(() => {
		async function checkEmailValid() {
			let data = await ClassesService.checkJoinLinkValid(token.token);
			setEmailValidForLink(data.success && data.isAccepted);
		}
		checkEmailValid();
	}, []);

	const onClickJoinClass = async function () {
		let data = await ClassesService.joinClass({ linkId: token.token });
		if (data.success) {
			const classId = data.classId.toString();
			history.push("/class/" + classId);
		}
	};
	const onClickFailedToJoin = async function () {
		history.push("/");
	};

	if (emailValidForLink) {
		return (
			<>
				<Dialog
					open={true}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{"Click join button to join the class"}
					</DialogTitle>
					<DialogActions>
						<Button onClick={onClickJoinClass} autoFocus>
							Agree
						</Button>
					</DialogActions>
				</Dialog>
			</>
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
