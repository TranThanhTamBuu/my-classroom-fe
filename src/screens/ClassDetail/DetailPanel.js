import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
			<Accordion>
				<Styled.MyContainer>
					<AccordionSummary
						expandIcon={<MoreVertIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<Typography color="white" noWrap variant="h4">
							{classDetail.name}
						</Typography>
					</AccordionSummary>
				</Styled.MyContainer>
				<AccordionDetails>
					<Typography>{"Subject: " + classDetail.subject}</Typography>
					<Typography>{"Section: " + classDetail.section}</Typography>
					<Typography>{"Room: " + classDetail.room}</Typography>
				</AccordionDetails>
			</Accordion>
			<Box sx={{ mt: 3 }} display="flex">
				<Stack spacing={2} sx={{ flexGrow: 1, mr: 3 }}>
					{inviteLink && (
						<Button
							variant="contained"
							sx={{ width: "85%" }}
							onClick={handleClickInvite}
						>
							Class Invitation Link
						</Button>
					)}
					<Button
						variant="contained"
						sx={{ width: "85%" }}
						onClick={handleClickClassGrade}
					>
						Class Grade Structure
					</Button>

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
				<Stack spacing={2} sx={{ flexGrow: 9 }}></Stack>
			</Box>
			<ModalInvite
				open={modalInvite}
				onClose={() => toggleModalInvite(false)}
				id={id}
			/>
			<ModalClassGrade
				isStudent={user.studentId.length > 0}
				open={modalClassGrade}
				onClose={() => toggleModalClassGrade(false)}
				id={classDetail._id}
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
