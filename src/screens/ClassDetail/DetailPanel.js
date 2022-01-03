import React, { useState } from "react";
import { Button } from "@mui/material";
import { useToggle } from "react-use";
import { Popper } from "@material-ui/core";
import Grow from "@mui/material/Grow";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { ModalClassGrade, ModalInvite } from "components";
import { useSelector } from "react-redux";
import * as Styled from "./ClassDetail.styled";
import { Typography } from "@mui/material";
import { Stack } from "@mui/material";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const SnackbarAlert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DetailPanel({
	classDetail,
	inviteLink,
	id,
	getGradeboard,
}) {
	const [addAnchorEl, setAddAnchorEl] = useState(false);
	const [addPopper, toggleAddPopper] = useToggle(false);
	const [modalInvite, toggleModalInvite] = useToggle(false);
	const [modalClassGrade, toggleModalClassGrade] = useToggle(false);
	const user = useSelector((state) => state.user);
	const [openCopyLinkAlert, setOpenCopyLinkAlert] = useState(false);
	const handleClickInvite = (e) => {
		setAddAnchorEl(e.currentTarget);
		toggleAddPopper(true);
	};
	const handleClickClassGrade = () => {
		toggleModalClassGrade(true);
	};
	return (
		<>
			<Styled.MyContainer>
				<Box>
					<Typography color="white" noWrap variant="h4">
						{classDetail.name}
					</Typography>
				</Box>
			</Styled.MyContainer>
			<div
				style={{
					background: "white",
					padding: "1rem",
					boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
				}}
			>
				<Typography>{"Subject: " + classDetail.subject}</Typography>
				<Typography>{"Section: " + classDetail.section}</Typography>
				<Typography>{"Room: " + classDetail.room}</Typography>
			</div>
			<Box sx={{ mt: 3 }} display="flex">
				<Stack spacing={2} sx={{ flexGrow: 1, mr: 3 }}>
					<Paper sx={{ p: 2 }}>
						<Typography>Class code</Typography>
						<b style={{color: "#1967d2"}}>{classDetail.enterCode}</b>
					</Paper>
					{inviteLink && (
						<Button
							variant="contained"
							sx={{ width: "85%" }}
							onClick={handleClickInvite}
						>
							Class Invitation Link
						</Button>
					)}

					<Popper
						open={addPopper}
						anchorEl={addAnchorEl}
						placement="bottom-end"
						disablePortal
						transition
					>
						{({ TransitionProps }) => (
							<Grow
								{...TransitionProps}
								style={{
									transformOrigin: "right top",
								}}
							>
								<Paper sx={{ width: "192px", zIndex: 1 }}>
									<ClickAwayListener
										onClickAway={() =>
											toggleAddPopper(false)
										}
									>
										<MenuList
											id="composition-menu"
											aria-labelledby="composition-button"
										>
											<MenuItem
												onClick={async () => {
													toggleAddPopper(false);
													setOpenCopyLinkAlert(true);
												}}
											>
												Copy link
											</MenuItem>
											<MenuItem
												onClick={() => {
													toggleAddPopper(false);
													toggleModalInvite(true);
												}}
											>
												Invite by link
											</MenuItem>
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
				</Stack>
				<Stack spacing={2} sx={{ flexGrow: 9 }}>
					{" "}
					<ModalClassGrade
						isStudent={user.studentId.length > 0}
						open={modalClassGrade}
						onClose={() => toggleModalClassGrade(false)}
						id={classDetail._id}
						getGradeboard={getGradeboard}
					/>
				</Stack>
			</Box>
			<ModalInvite
				open={modalInvite}
				onClose={() => toggleModalInvite(false)}
				id={id}
			/>

			<Snackbar
				open={openCopyLinkAlert}
				autoHideDuration={6000}
				onClose={() => {
					setOpenCopyLinkAlert(false);
				}}
			>
				<SnackbarAlert
					onClose={() => {
						setOpenCopyLinkAlert(false);
					}}
					severity="success"
					sx={{ width: "100%" }}
				>
					{inviteLink}
				</SnackbarAlert>
			</Snackbar>
		</>
	);
}
