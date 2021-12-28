import React, { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import UsersTab from "./UsersTab";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export default function Admin() {
	const [value, setValue] = React.useState(0);
	const user = useSelector((state) => state.user);
	const history = useHistory();

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(() => {
		if (user && !user.accessToken && !user.isAdmin) {
			history.replace("/404");
		}
	}, [user]);

	return (
		<Box sx={{ width: "100%", height: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					<Tab label="Users" {...a11yProps(0)} />
					<Tab label="Classes" {...a11yProps(1)} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				<UsersTab />
			</TabPanel>
			<TabPanel value={value} index={1}>
				Classes
			</TabPanel>
		</Box>
	);
}
