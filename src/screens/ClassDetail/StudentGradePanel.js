import React from "react";
import Box from "@mui/material/Box";
import { useToggle } from "react-use";
import { Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import ModalRequestReview from "./ModalRequestReview";
import ListRequestReview from "./ListRequestReview";

export default function StudentGradePanel(props) {
	const [openModal, setOpenModal] = useToggle(false);
	let gradeList = [];
	for (const [key, value] of Object.entries(props.gradeBoard.data)) {
		if (key !== "FullName" && key !== "studentId")
			gradeList.push({
				name: key,
				...value,
				position: props.gradeBoard.assignmentIndex[key],
			});
	}

	gradeList = gradeList.sort((a, b) => a.position - b.position);
	console.log(props.gradeBoard);

	return (
		<div>
			{gradeList.length > 0 ? (
				<>
					<Box sx={{ mb: 2 }}>
						<Button
							variant="contained"
							onClick={() => {
								setOpenModal(true);
							}}
						>
							Request Grade Review
						</Button>
					</Box>
					<TableContainer component={Paper}>
						<Table size="small" aria-label="simple table">
							<TableHead>
								<TableRow>
									{gradeList.map((grade) => (
										<TableCell
											sx={{ p: 1 }}
											align="center"
											key={`Header${grade.name}`}
										>
											{grade.name}
										</TableCell>
									))}
									<TableCell
										sx={{ p: 1 }}
										align="center"
										key={`HeaderTotal`}
									>
										Total
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									{gradeList.map((grade) => (
										<TableCell
											align="center"
											sx={{ p: 1 }}
											key={`Value${grade.name}`}
										>
											{grade.studentPoint
												? grade.studentPoint
												: ""}
										</TableCell>
									))}
									<TableCell
										align="center"
										sx={{ p: 1 }}
										key={`ValueTotal`}
									>
										{gradeList.every(
											(item) =>
												item.studentPoint !== null &&
												item.studentPoint !== undefined
										)
											? gradeList.reduce((a, b) => {
													return {
														studentPoint:
															a.studentPoint +
															b.studentPoint,
													};
											  }).studentPoint
											: ""}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
					<ListRequestReview
						gradeList={gradeList.filter(
							(item) => item.isReviewRequest
						)}
					/>
					<ModalRequestReview
						open={openModal}
						onClose={() => {
							setOpenModal(false);
						}}
						gradeList={gradeList}
					/>
				</>
			) : (
				<h2>Waiting for teacher to upload</h2>
			)}
		</div>
	);
}
