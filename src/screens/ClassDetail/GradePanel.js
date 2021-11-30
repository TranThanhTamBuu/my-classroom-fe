import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { Container, Typography } from "@mui/material";
import { HyperlinkText } from "components";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import * as Styled from "./ClassDetail.styled";
import { Button } from "@mui/material";
import { useToggle } from "react-use";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { GridEvents, useGridApiRef, DataGridPro } from "@mui/x-data-grid-pro";
import { Paper } from "@mui/material";
import ClassesService from "services/classes.service";
import { useParams } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { Stack } from "@mui/material";
import ModalUploadGrade from "./ModalUploadGrade";
import { useSelector } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const SnackbarAlert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function GradePanel(props) {
	const apiRef = useGridApiRef();
	const [openError, setOpenError] = useToggle(false);
	const [openModal, setOpenModal] = useToggle(false);
	const [openBackdrop, setBackDrop] = useToggle(false);
	const user = useSelector((state) => state.user);
	const classDetail = useSelector((state) => state.classDetail);
	const isTeacher = user.studentId === "";
	const listGrade = props.gradeBoard.data.map((row) => {
		return { ...row, id: row.StudentId };
	});
	const { id } = useParams();
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
	useEffect(() => {
		apiRef.current.subscribeEvent(
			GridEvents.cellEditCommit,
			(params, event) => {
				console.log(
					`Editing cell with value: ${params.value} and row id: ${params.id}, column: ${params.field}, triggered by ${event.type}.`
				);
				setBackDrop(true);
				ClassesService.setListGrade({
					assignmentId: props.gradeBoard.maxPoint[params.field].id,
					isImport: false,
					listGrade: [
						{
							grade: params.value,
							studentId: params.id,
						},
					],
				})
					.then(() => {
						console.log("edit success");
						props.setGradeBoard();
					})
					.catch((err) => {
						console.log(err);
					})
					.finally(() => {
						setBackDrop(false);
					});
			}
		);
	}, [apiRef]);
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

			if (
				data.length === 0 ||
				!data[0]["StudentID"] ||
				!data[0]["Name"]
			) {
				setOpenError(true);
			} else {
				ClassesService.putStudentList({
					classId: id,
					listStudent: data.map((student) => {
						return {
							name: student.Name,
							id: student.StudentID,
						};
					}),
				});
				props.setGradeBoard();
			}
		};

		fileReader.onerror = (error) => {
			throw error;
		};
	};

	let assignmentsColumn = [];
	for (const [key, value] of Object.entries(props.gradeBoard.maxPoint)) {
		assignmentsColumn.push({
			name: key,
			maxPoint: value.point,
			id: value.id,
		});
	}

	const columns = [
		{
			field: "FullName",
			width: 200,
			headerAlign: "center",
			editable: false,
			renderHeader: () => <strong>{"Fullname"}</strong>,
			renderCell: (params) => {
				let listJoined = classDetail.students.map(
					(student) => student.studentId
				);
				if (listJoined.includes(params.id))
					return (
						<strong style={{ textDecoration: "underline" }}>
							{params.value}
						</strong>
					);
				else return <p>{params.value}</p>;
			},
		},
		{
			field: "StudentId",
			width: 120,
			align: "center",
			headerAlign: "center",
			editable: false,
			renderHeader: () => <strong>{"Student ID"}</strong>,
		},
		{
			field: "Total",
			headerName: "Total",
			width: 120,
			headerAlign: "center",
			editable: false,
			align: "center",
			renderHeader: () => <strong>{"Total"}</strong>,
			valueGetter: (params) => {
				let sum = 0;
				assignmentsColumn.forEach((cur) => {
					let v1 = params.getValue(params.id, cur.name) ?? 0;
					sum += v1;
				});
				return sum;
			},
		},
		...assignmentsColumn.map((key) => {
			return {
				field: key.name,
				width: 120,
				editable: isTeacher,
				headerAlign: "center",
				align: "center",
				type: "number",
				renderHeader: () => (
					<Stack justifyContent="center" alignItems="center">
						<strong
							style={{
								wordWrap: "break-word",
								lineHeight: "10px",
								margin: "5px",
							}}
						>
							{`${key.name}`}
						</strong>
						<p
							style={{ lineHeight: "5px", margin: "5px" }}
						>{`Out of ${key.maxPoint}`}</p>
					</Stack>
				),

				preProcessEditCellProps: (params) => {
					const hasError =
						params.props.value < 0 ||
						params.props.value > Number(key.maxPoint);
					if (hasError) setOpenError(true);
					return { ...params.props, error: hasError };
				},
			};
		}),
	];
	return (
		<>
			{listGrade.length > 0 ? (
				<>
					<Paper sx={{ height: "100%", width: "100%" }}>
						{isTeacher && (
							<Button
								variant="contained"
								onClick={() => {
									setOpenModal(true);
								}}
							>
								Import
							</Button>
						)}
						<DataGridPro
							apiRef={apiRef}
							rows={listGrade}
							columns={columns}
							disableSelectionOnClick
							disableColumnMenu
							headerHeight={80}
						/>
					</Paper>
					<Snackbar
						open={openError}
						autoHideDuration={6000}
						onClose={() => {
							setOpenError(false);
						}}
					>
						<SnackbarAlert
							onClose={() => {
								setOpenError(false);
							}}
							severity="error"
							sx={{ width: "100%" }}
						>
							Point must be greater than 0 and smaller than max
							point
						</SnackbarAlert>
					</Snackbar>
					<ModalUploadGrade
						openModal={openModal}
						onClose={setOpenModal}
						listAssignment={assignmentsColumn}
						setGradeBoard={() => {
							props.setGradeBoard();
						}}
						listStudent={listGrade.map((item) => item.StudentId)}
					/>
					<Backdrop
						sx={{
							color: "#fff",
							zIndex: (theme) => theme.zIndex.drawer + 1,
						}}
						open={openBackdrop}
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				</>
			) : (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						height: "100%",
					}}
				>
					{isTeacher ? (
						<>
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
							</Container>
							<Collapse in={openError}>
								<Alert
									severity="error"
									onClose={() => {
										setOpenError(false);
									}}
								>
									Invalid file !!!! Please upload again.
								</Alert>
							</Collapse>
							<Typography>
								Please upload your student list
							</Typography>
							<Box sx={{ display: "inline-flex" }}>
								<Typography>See this&nbsp; </Typography>
								<HyperlinkText
									component="p"
									variant="body1"
									sx={{ lineHeight: 1.5 }}
									text="template"
									onClick={() => {
										let ws = XLSX.utils.json_to_sheet(
											[
												{
													StudentID: "18127011",
													Name: "Đặng Minh Hoàng Long",
												},
												{
													StudentID: "18127236",
													Name: "Hồ Đại Trí",
												},
												{
													StudentID: "18127268",
													Name: "Trần Thanh Tâm",
												},
											],
											{
												header: ["StudentID", "Name"],
											}
										);
										let wb = XLSX.utils.book_new();
										XLSX.utils.book_append_sheet(
											wb,
											ws,
											"Sheet 1"
										);
										XLSX.writeFile(
											wb,
											"list_student_template.xlsx"
										);
									}}
								/>
								<Typography>
									&nbsp;to upload list student
								</Typography>
							</Box>
						</>
					) : (
						<Typography>
							Waiting for teacher to upload list student
						</Typography>
					)}
				</Box>
			)}
		</>
	);
}
