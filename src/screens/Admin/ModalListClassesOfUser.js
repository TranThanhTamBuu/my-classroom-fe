import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import ClassesService from "services/classes.service";
import { useToggle } from "react-use";
import { RouteUrl } from "constants/router";
import { useHistory } from "react-router";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Box } from "@mui/material";
export default function ModalListClassesOfUser({ open, onClose, userId }) {
	const [loading, setLoading] = useToggle(false);
	const [listClasses, setClasses] = useState([]);
	const history = useHistory();

	useEffect(() => {
		async function getClasses() {
			setLoading(true);
			if (userId) {
				ClassesService.getClassesbyUser(userId)
					.then((res) => {
						setClasses(res);
					})
					.finally(() => {
						setLoading(false);
					});
			}
		}
		getClasses();
	}, [userId]);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth={true}
			maxWidth={"md"}
			scroll="paper"
		>
			<DialogTitle>List class of user</DialogTitle>
			<DialogContent>
				{loading ? (
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<CircularProgress />
					</Box>
				) : (
					<List>
						{listClasses.map((item) => (
							<ListItem disablePadding key={item.classId}>
								<ListItemButton
									onClick={() => {
										history.push(
											`${RouteUrl.CLASS}/${item.classId}`
										);
									}}
								>
									<ListItemText primary={item.className} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>
					<Typography variant="button">{"Close"}</Typography>
				</Button>
			</DialogActions>
		</Dialog>
	);
}
