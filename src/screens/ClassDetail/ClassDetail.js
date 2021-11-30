import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import * as Styled from "./ClassDetail.styled";
import { useParams } from "react-router-dom";
import ClassesService from "services/classes.service";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import DetailPanel from "./DetailPanel";
import PeoplePanel from "./PeoplePanel";
import GradePanel from "./GradePanel";
import { setClassDetail, removeClassDetail } from "actions/classDetail.action";
import { useSelector, useDispatch } from "react-redux";

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
					}}
				>
					{children}
				</Box>
			)}
		</Styled.TabContainer>
	);
}

export default function ClassDetail() {
	const dispatch = useDispatch();
	const [tabIndex, setTabIndex] = useState(0);
	const [inviteLink, setInviteLink] = useState("");
	const [openError, setOpenErrorModal] = useState(false);
	const [gradeBoard, setGradeBoard] = useState([]);

	const classDetail = useSelector((state) => state.classDetail);
	const { id } = useParams();

	useEffect(() => {
		async function getDetailClass() {
			let data = await ClassesService.getDetailClass(id);
			dispatch(setClassDetail(data));

			let grade = await ClassesService.getGradeboard(id);
			setGradeBoard(grade);
			try {
				let inviteLink = await ClassesService.inviteToClass({
					classId: id,
				});
				setInviteLink(inviteLink.link);
			} catch (err) {
				console.log(err);
			}
		}
		getDetailClass();
		return () => {
			dispatch(removeClassDetail());
		};
	}, []);

	if (!classDetail)
		return (
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
		);
	return (
		<>
			<Box sx={{ pb: 7, height: "100%" }}>
				<TabPanel value={tabIndex} index={0}>
					<DetailPanel
						classDetail={classDetail}
						inviteLink={inviteLink}
						id={id}
					/>
				</TabPanel>
				<TabPanel value={tabIndex} index={1}>
					<GradePanel
						gradeBoard={gradeBoard}
						setGradeBoard={async () => {
							let grade = await ClassesService.getGradeboard(id);
							setGradeBoard(grade);
						}}
					/>
				</TabPanel>
				<TabPanel value={tabIndex} index={2}>
					<PeoplePanel classDetail={classDetail} />
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
