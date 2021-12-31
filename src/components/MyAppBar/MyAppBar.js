import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import AppsIcon from "@mui/icons-material/Apps";
import Popper from "@mui/core/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { useToggle } from "react-use";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { ModalCreateClass, ModalJoinClass } from "components";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "actions/user.action";
import { useHistory } from "react-router-dom";
import { RouteUrl } from "constants/router";

export default function MyAppBar({ openDrawer }) {
	const [addAnchorEl, setAddAnchorEl] = useState(false);
	const [addPopper, toggleAddPopper] = useToggle(false);
	const [avatarAnchorEl, setAvatarAnchorEl] = useState(false);
	const [avatarPopper, toggleAvatarPopper] = useToggle(false);
	const [modalCreateClass, toggleModalCreateClass] = useToggle(false);
	const [modalJoinClass, toggleModalJoinClass] = useToggle(false);
	const user = useSelector((state) => state.user);
	const classDetail = useSelector((state) => state.classDetail);
	const dispatch = useDispatch();
	const history = useHistory();

	const handleClickAdd = (e) => {
		setAddAnchorEl(e.currentTarget);
		toggleAddPopper(true);
	};

	const handleClickAvatar = (e) => {
		setAvatarAnchorEl(e.currentTarget);
		toggleAvatarPopper(true);
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
						<IconButton
							size="large"
							color="inherit"
							aria-label="add"
						>
							<AppsIcon />
						</IconButton>
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
													<MenuItem
														onClick={onAdminPanelClick()}
													>
														Admin Panel
													</MenuItem>
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
