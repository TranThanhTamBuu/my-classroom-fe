import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDropzone } from "react-dropzone";
import ClassesService from "services/classes.service";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Paper, Container } from "@mui/material";
import * as Styled from "./ClassDetail.styled";
import * as XLSX from "xlsx";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { useToggle } from "react-use";
import { Box } from "@mui/system";
import { HyperlinkText } from "components";

export default function ModalUploadGrade({
	openModal,
	onClose,
	listAssignment,
	listStudent,
	setGradeBoard,
}) {
	// const dispatch = useDispatch();
	const [assignment, setAssignment] = useState();
	const [openError, setOpenError] = useToggle(false);
	const { getRootProps, open, getInputProps } = useDropzone({
		maxFiles: 1,
		noClick: true,
		multiple: false,
		noKeyboard: true,
		accept: ".xlsx,.csv,.xls",
		onDropAccepted: ([file]) => {
			readExcel(file);
		},
	});

	const readExcel = (file) => {
		// eslint-disable-next-line no-undef
		const fileReader = new FileReader();
		fileReader.readAsArrayBuffer(file);

		fileReader.onload = (e) => {
			const bufferArray = e.target.result;

			const wb = XLSX.read(bufferArray, { type: "buffer" });

			const wsname = wb.SheetNames[0];

			const ws = wb.Sheets[wsname];

			const data = XLSX.utils.sheet_to_json(ws);
			console.log(data);
			if (
				data.length === 0 ||
				!data[0]["StudentID"] ||
				!data[0]["Point"] ||
				!assignment ||
				!data.every(
					(item) =>
						item.Point !== null &&
						item.Point >= 0 &&
						item.Point <= assignment.maxPoint
				)
			) {
				console.log("Invalid file");
				setOpenError(true);
			} else {
				console.log("Valid file");
				ClassesService.setListGrade({
					assignmentId: assignment.id,
					isImport: true,
					listGrade: data.map((student) => {
						return {
							grade: student.Point,
							studentId: student.StudentID,
						};
					}),
				}).then(() => {
					setGradeBoard();
					onClose();
				});
			}

			fileReader.onerror = (error) => {
				throw error;
			};
		};
	};

	const handleChange = (event) => {
		setAssignment(event.target.value);
	};

	return (
		<Dialog
			open={openModal}
			onClose={onClose}
			fullWidth={true}
			maxWidth={"sm"}
		>
			<DialogTitle>Upload Grade</DialogTitle>
			<DialogContent>
				<FormControl fullWidth sx={{ mt: 2 }}>
					<InputLabel>Assignment</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={assignment}
						label="Assignment"
						onChange={handleChange}
					>
						{listAssignment.map((assignment) => (
							<MenuItem
								key={assignment.id}
								value={assignment}
							>{`${assignment.name}`}</MenuItem>
						))}
					</Select>
				</FormControl>
				<Paper>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Container>
							<Styled.MyFileInput {...getRootProps()}>
								<input {...getInputProps()} />
								<Styled.UploadPicture
									src={
										process.env.PUBLIC_URL +
										"/icon/upload_file.svg"
									}
									alt="upload_icon"
								/>
								<Button variant="contained" onClick={open}>
									Upload
								</Button>
								<p>Or drag a file here</p>
							</Styled.MyFileInput>
							<Collapse in={openError}>
								<Alert
									severity="error"
									onClose={() => {
										setOpenError(false);
									}}
								>
									Error!!!! You need to select assignment and
									upload right template.
								</Alert>
							</Collapse>
						</Container>

						<Box
							sx={{
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Typography>See this&nbsp; </Typography>
							<HyperlinkText
								component="p"
								variant="body1"
								sx={{ lineHeight: 1.5 }}
								text="template"
								onClick={() => {
									let ws = XLSX.utils.json_to_sheet(
										[
											...listStudent.map((student) => {
												return { StudentID: student };
											}),
										],
										{
											header: ["StudentID", "Point"],
										}
									);
									let wb = XLSX.utils.book_new();
									XLSX.utils.book_append_sheet(
										wb,
										ws,
										"Sheet 1"
									);
									XLSX.writeFile(wb, "grade_template.xlsx");
								}}
							/>
							<Typography>&nbsp;to upload grade</Typography>
						</Box>
					</Box>
				</Paper>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>
					<Typography variant="button">Close</Typography>
				</Button>
			</DialogActions>
		</Dialog>
	);
}
