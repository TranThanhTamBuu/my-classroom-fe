import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import * as Styled from "./ClassDetail.styled";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useParams } from "react-router-dom";
import { Stack } from "@mui/material";
import ClassesService from "services/classes.service";
import { Button } from "@mui/material";
import { useToggle } from "react-use";
import { Popper } from "@material-ui/core";
import Grow from "@mui/material/Grow";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { ModalInvite } from "components";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const SnackbarAlert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Styled.TabContainer
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box
					sx={{
						height: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					{children}
				</Box>
			)}
		</Styled.TabContainer>
	);
}

export default function ClassDetail() {
	const [tabIndex, setTabIndex] = useState(0);
	const [inviteLink, setInviteLink] = useState("");
	const [openError, setOpenErrorModal] = useState(false);
	const [addAnchorEl, setAddAnchorEl] = useState(false);
	const [addPopper, toggleAddPopper] = useToggle(false);
	const [modalInvite, toggleModalInvite] = useToggle(false);
	const [classDetail, setClassDetail] = useState({
		name: "",
		subjec: "",
		section: "",
		room: "",
		teachers: [],
		students: [],
	});
	const { id } = useParams();

	useEffect(() => {
		async function getDetailClass() {
			let data = await ClassesService.getDetailClass(id);
			setClassDetail(data);
		}
		getDetailClass();
	}, []);

	const handleClickAdd = (e) => {
		setAddAnchorEl(e.currentTarget);
		toggleAddPopper(true);
	};

	return (
		<>
			<Box sx={{ pb: 7 }}>
				<TabPanel value={tabIndex} index={0}>
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
							<Typography>
								{"Subject: " + classDetail.subject}
							</Typography>
							<Typography>
								{"Section: " + classDetail.section}
							</Typography>
							<Typography>
								{"Room: " + classDetail.room}
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Box sx={{ mt: 3 }} display="flex">
						<Stack spacing={2} sx={{ flexGrow: 1, mr: 3 }}>
							<Button
								variant="contained"
								sx={{ width: "85%" }}
								onClick={handleClickAdd}
							>
								Class Invitation Link
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
										<Paper
											sx={{ width: "192px", zIndex: 1 }}
										>
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
															toggleAddPopper(
																false
															);

															let rs =
																await ClassesService.inviteToClass(
																	{
																		classId:
																			id,
																	}
																);
															setInviteLink(
																rs.link
															);
														}}
													>
														Copy link
													</MenuItem>
													<MenuItem
														onClick={() => {
															toggleAddPopper(
																false
															);
															toggleModalInvite(
																true
															);
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
				</TabPanel>
				<TabPanel value={tabIndex} index={1}>
					2
				</TabPanel>
				<TabPanel value={tabIndex} index={2}>
					<Typography variant="h4">Teachers</Typography>
					<Divider />
					<List>
						{classDetail.teachers.map(({ name, _id }) => (
							<ListItem button key={_id} divider>
								<ListItemAvatar>
									<Avatar alt={name} />
								</ListItemAvatar>
								<ListItemText primary={name} />
							</ListItem>
						))}
					</List>
					<Stack
						direction="row"
						justifyContent="space-between"
						sx={{ mt: 3 }}
					>
						<Typography variant="h4">Students</Typography>
						<Typography variant="h6">
							{classDetail.students.length + " Students"}
						</Typography>
					</Stack>
					<Divider />
					<List>
						{classDetail.students.map(({ name, _id }) => (
							<ListItem button key={_id} divider>
								<ListItemAvatar>
									<Avatar alt={name} />
								</ListItemAvatar>
								<ListItemText primary={name} />
							</ListItem>
						))}
					</List>
				</TabPanel>
				<Paper
					sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
					elevation={3}
				>
					<BottomNavigation
						showLabels
						value={tabIndex}
						onChange={(event, newValue) => {
							setTabIndex(newValue);
						}}
					>
						<BottomNavigationAction label="Detail" />
						<BottomNavigationAction label="Grade" />
						<BottomNavigationAction label="People" />
					</BottomNavigation>
				</Paper>
			</Box>
			<ModalInvite
				open={modalInvite}
				onClose={() => toggleModalInvite(false)}
				id={id}
			/>
			<Snackbar
				open={inviteLink}
				autoHideDuration={6000}
				onClose={() => {
					setInviteLink("");
				}}
			>
				<SnackbarAlert
					onClose={() => {
						setInviteLink("");
					}}
					severity="success"
					sx={{ width: "100%" }}
				>
					{inviteLink}
				</SnackbarAlert>
			</Snackbar>
			<Snackbar
				open={openError}
				autoHideDuration={6000}
				onClose={() => {
					setOpenErrorModal(false);
				}}
			>
				<SnackbarAlert
					onClose={() => {
						setOpenErrorModal(false);
					}}
					severity="error"
					sx={{ width: "100%" }}
				>
					Oops... Something went wrong!!!!!
				</SnackbarAlert>
			</Snackbar>
		</>
	);
}
