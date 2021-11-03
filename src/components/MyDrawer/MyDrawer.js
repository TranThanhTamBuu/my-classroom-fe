import React from "react";
import Drawer from "@mui/material/Drawer";
import HomeIcon from "@mui/icons-material/Home";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SettingsIcon from "@mui/icons-material/Settings";
import ArchiveIcon from "@mui/icons-material/Archive";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

const listItemsBeforeDivider = [
	{ title: "Classes", icon: HomeIcon },
	{ title: "Calendar", icon: CalendarTodayIcon },
];

const listItemsAfterDivider = [
	{ title: "Archived classes", icon: ArchiveIcon },
	{ title: "Settings", icon: SettingsIcon },
];

export default function MyDrawer({ open, onClose }) {
	const renderItem = ({ title, icon: Icon }) => (
		<ListItem button key={title} onClick={() => console.log(title)}>
			<ListItemIcon>
				<Icon />
			</ListItemIcon>
			<ListItemText primary={title} />
		</ListItem>
	);

	const renderListItems = () => (
		<Box
			sx={{
				width: 250,
			}}
			onClick={onClose}
			onKeyDown={onClose}
		>
			<List>
				{listItemsBeforeDivider.map((item) => renderItem(item))}
			</List>
			<Divider />
			<List>{listItemsAfterDivider.map((item) => renderItem(item))}</List>
		</Box>
	);

	return (
		<Drawer anchor="left" open={open} onClose={onClose}>
			{renderListItems()}
		</Drawer>
	);
}
