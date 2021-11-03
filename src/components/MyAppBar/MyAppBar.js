import React, { useState } from "react";
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
import { useToggle } from "react-use";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { ModalCreateClass } from "components";

export default function MyAppBar({ openDrawer }) {
	const [addAnchorEl, setAddAnchorEl] = useState(false);
	const [addPopper, toggleAddPopper] = useToggle(false);
	const [modalCreateClass, toggleModalCreateClass] = useToggle(false);

	const handleClickAdd = (e) => {
		setAddAnchorEl(e.currentTarget);
		toggleAddPopper(true);
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
							My Classroom
						</Typography>
						<div>
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
													<MenuItem>
														Enroll class
													</MenuItem>
													<MenuItem
														onClick={() => {
															toggleAddPopper(
																false
															);
															toggleModalCreateClass(
																true
															);
														}}
													>
														Create class
													</MenuItem>
												</MenuList>
											</ClickAwayListener>
										</Paper>
									</Grow>
								)}
							</Popper>
						</div>
						<IconButton
							size="large"
							color="inherit"
							aria-label="add"
						>
							<AppsIcon />
						</IconButton>
						<IconButton
							size="large"
							color="inherit"
							aria-label="account"
						>
							<Avatar />
						</IconButton>
					</Toolbar>
				</AppBar>
			</Box>
			<ModalCreateClass
				open={modalCreateClass}
				onClose={() => toggleModalCreateClass(false)}
			/>
		</>
	);
}
