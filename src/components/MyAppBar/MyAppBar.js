import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Popper from "@mui/core/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { useToggle } from "react-use";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { ModalCreateClass, ModalJoinClass, NotificationItem } from "components";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "actions/user.action";
import { useHistory } from "react-router-dom";
import { RouteUrl } from "constants/router";
import * as Styled from "./MyAppBar.styled";
import notificationService from "services/notification.service";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CheckIcon from "@mui/icons-material/Check";
import { io } from "socket.io-client";
const socket = io(process.env.REACT_APP_BE_URL);

export default function MyAppBar({ openDrawer }) {
	const [addAnchorEl, setAddAnchorEl] = useState(false);
	const [notificationAnchorEl, setNotificationAnchorEl] = useState(false);
	const [addPopper, toggleAddPopper] = useToggle(false);
	const [avatarAnchorEl, setAvatarAnchorEl] = useState(false);
	const [avatarPopper, toggleAvatarPopper] = useToggle(false);
	const [modalCreateClass, toggleModalCreateClass] = useToggle(false);
	const [modalJoinClass, toggleModalJoinClass] = useToggle(false);
	const user = useSelector((state) => state.user);
	const classDetail = useSelector((state) => state.classDetail);
	const [uncheckNotification, setUncheckNotification] = useState(0);
	const [notification, setNotification] = useState([]);
	const [showNotification, toggleShowNotification] = useToggle(false);
	const [filterNotification, toggleFilterNotification] = useToggle(true);
	const dispatch = useDispatch();
	const history = useHistory();

	const fetchNotification = async () => {
		const response = await notificationService.getNotifications();
		console.log(
			"🚀 ~ file: MyAppBar.js ~ line 51 ~ fetchNotification ~ response",
			response
		);
		setNotification(response);
	};

	useEffect(() => {
		setUncheckNotification(
			notification.filter(({ isRead }) => !isRead).length
		);
	}, [notification]);

	useEffect(() => {
		if (user._id) {
			fetchNotification();

			socket.on("connect", () => {
				console.log(
					"🚀 ~ file: MyAppBar.js ~ line 62 ~ socket.on ~ socket",
					socket.id
				);
			});

			socket.emit("listen", user._id);
			socket.on("notify", handleNotification);
		}
	}, [user]);

	const handleNotification = (data) => {
		setNotification((state) => [data, ...state]);
	};

	const handleClickAdd = (e) => {
		setAddAnchorEl(e.currentTarget);
		toggleAddPopper(true);
	};

	const handleClickNotification = (e) => {
		setNotificationAnchorEl(e.currentTarget);
		toggleShowNotification(true);
	};

	const handleClickAvatar = (e) => {
		setAvatarAnchorEl(e.currentTarget);
		toggleAvatarPopper(true);
	};

	const readNotifications = async (notificationIds) => {
		const data = await notificationService.readNotifications({
			notificationIds,
		});
		if (data) await fetchNotification();
	};

	const readAllNotification = async () => {
		const notificationIds = notification.map((item) => item._id);

		if (notificationIds.length === 0) return;

		const data = await notificationService.readNotifications({
			notificationIds,
		});

		if (data) await fetchNotification();
	};

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
							onClick={openDrawer}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" sx={{ flexGrow: 1 }}>
							{classDetail ? classDetail.name : "My Classroom"}
						</Typography>
						{!classDetail && (
							<div style={{ zIndex: 3 }}>
								<IconButton
									size="large"
									color="inherit"
									aria-label="add"
									onClick={handleClickAdd}
								>
									<AddIcon />
								</IconButton>
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
												sx={{
													width: "192px",
													zIndex: 1,
												}}
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
															onClick={onJoinClassClick()}
														>
															Enroll class
														</MenuItem>
														{!user.studentId && (
															<MenuItem
																onClick={onCreateClassClick()}
															>
																Create class
															</MenuItem>
														)}
													</MenuList>
												</ClickAwayListener>
											</Paper>
										</Grow>
									)}
								</Popper>
							</div>
						)}
						<div>
							<IconButton
								size="large"
								color="inherit"
								aria-label="notification"
								onClick={handleClickNotification}
							>
								<Styled.Badge
									overlap="circular"
									badgeContent={uncheckNotification}
									color="secondary"
								>
									<NotificationsIcon />
								</Styled.Badge>
							</IconButton>
							<Popper
								open={showNotification}
								anchorEl={notificationAnchorEl}
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
											sx={{
												width: "360px",
												maxHeight: "480px",
												zIndex: 1,
												overflowY: "auto",
											}}
										>
											<ClickAwayListener
												onClickAway={() =>
													toggleShowNotification(
														false
													)
												}
											>
												<MenuList
													id="composition-menu"
													aria-labelledby="composition-button"
												>
													<Stack
														direction="row"
														alignItems="center"
														justifyContent="space-between"
														sx={{
															padding: "0 16px",
														}}
													>
														<Typography
															variant="h5"
															sx={{
																fontWeight:
																	"bold",
															}}
														>
															Notifications
														</Typography>
														<Tooltip title="Mark all as read">
															<IconButton
																onClick={
																	readAllNotification
																}
															>
																<CheckIcon />
															</IconButton>
														</Tooltip>
													</Stack>
													<Stack
														direction="row"
														alignItems="center"
														gap="8px"
														sx={{
															padding: "0 16px",
														}}
													>
														<Chip
															color={
																filterNotification
																	? "secondary"
																	: "default"
															}
															label="All"
															onClick={() =>
																toggleFilterNotification(
																	true
																)
															}
														/>
														<Chip
															color={
																filterNotification
																	? "default"
																	: "secondary"
															}
															label="Unread"
															onClick={() =>
																toggleFilterNotification(
																	false
																)
															}
														/>
													</Stack>
													<Typography
														variant="subtitle2"
														sx={{
															fontWeight: "bold",
															padding: "8px 16px",
														}}
													>
														Earlier
													</Typography>
													{notification.filter(
														(item) =>
															filterNotification
																? true
																: !item.isRead
													).length === 0 && (
														<Typography
															variant="subtitle2"
															color="lightGray"
															sx={{
																padding:
																	"4px 16px",
																width: "100%",
																textAlign:
																	"center",
																height: "52px",
																lineHeight:
																	"52px",
																fontWeight:
																	"bold",
															}}
														>
															You don't have any
															notifications.
														</Typography>
													)}
													{notification
														.filter((item) =>
															filterNotification
																? true
																: !item.isRead
														)
														.map((item) => (
															<NotificationItem
																key={item._id}
																{...item}
																readNotification={() =>
																	readNotifications(
																		[
																			item._id,
																		]
																	)
																}
															/>
														))}
												</MenuList>
											</ClickAwayListener>
										</Paper>
									</Grow>
								)}
							</Popper>
						</div>
						<div style={{ zIndex: 3 }}>
							<Tooltip
								title={
									<React.Fragment>
										<Typography
											color="inherit"
											sx={{ fontWeight: "bold" }}
										>
											{user.name}
										</Typography>
										<Typography color="pink">
											{user.email}
										</Typography>
									</React.Fragment>
								}
							>
								<IconButton
									size="large"
									color="inherit"
									aria-label="account"
									onClick={handleClickAvatar}
								>
									<Avatar src={user.photo} />
								</IconButton>
							</Tooltip>
							<Popper
								open={avatarPopper}
								anchorEl={avatarAnchorEl}
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
										<Paper sx={{ width: "192px" }}>
											<ClickAwayListener
												onClickAway={() =>
													toggleAvatarPopper(false)
												}
											>
												<MenuList
													id="composition-menu"
													aria-labelledby="composition-button"
												>
													{user.isAdmin && (
														<MenuItem
															onClick={onAdminPanelClick()}
														>
															Admin Panel
														</MenuItem>
													)}
													<MenuItem
														onClick={onSettingClick()}
													>
														Setting
													</MenuItem>
													<MenuItem
														onClick={onSignOutClick()}
													>
														Sign out
													</MenuItem>
												</MenuList>
											</ClickAwayListener>
										</Paper>
									</Grow>
								)}
							</Popper>
						</div>
					</Toolbar>
				</AppBar>
			</Box>

			<ModalCreateClass
				open={modalCreateClass}
				onClose={() => toggleModalCreateClass(false)}
			/>
			<ModalJoinClass
				open={modalJoinClass}
				onClose={() => toggleModalJoinClass(false)}
			/>
		</>
	);

	function onJoinClassClick() {
		return () => {
			toggleAddPopper(false);
			toggleModalJoinClass(true);
		};
	}

	function onCreateClassClick() {
		return () => {
			toggleAddPopper(false);
			toggleModalCreateClass(true);
		};
	}

	function onSignOutClick() {
		return () => {
			toggleAvatarPopper(false);
			dispatch(signOut());
			history.push("/");
		};
	}

	function onSettingClick() {
		return () => {
			toggleAvatarPopper(false);
			history.push(RouteUrl.SETTING);
		};
	}

	function onAdminPanelClick() {
		return () => {
			toggleAvatarPopper(false);
			history.push(RouteUrl.ADMIN);
		};
	}
}
