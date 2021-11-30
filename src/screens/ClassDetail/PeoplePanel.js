import React, { useState } from "react";
import { Divider } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@mui/material";
import { Stack } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const SnackbarAlert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PeoplePanel({ classDetail }) {
    
	return (
		<>
			<Typography variant="h4">Teachers</Typography>
			<Divider />
			<List>
				{classDetail.teachers.map(({ name, _id }) => (
					<ListItem button key={_id} divider>
						<ListItemAvatar>
							<Avatar {...stringAvatar(name)} />{" "}
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
							<Avatar {...stringAvatar(name)} />
						</ListItemAvatar>
						<ListItemText primary={name} />
					</ListItem>
				))}
			</List>
		</>
	);
}
function stringToColor(string) {
	let hash = 0;
	let i;

	/* eslint-disable no-bitwise */
	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.substr(-2);
	}
	/* eslint-enable no-bitwise */

	return color;
}

function stringAvatar(name) {
	let word = name.split(" ");
	return {
		sx: {
			bgcolor: stringToColor(name),
		},
		children: `${word[0][0]}${word[word.length - 1][0]}`,
	};
}
