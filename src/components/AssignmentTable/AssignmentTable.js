import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AssignmentRow from "components/AssignmentRow";

export default function AssignmentTable({
	items,
	onClickDelete,
	onClickEdit,
	onClickCancelEdit,
	onClickSaveEdit,
	handleOnDragEnd,
	isStudent,
}) {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 200 }} aria-label="simple table">
				<TableHead>
					<TableRow>
					{!isStudent && <TableCell></TableCell>}
						<TableCell align="center">Name</TableCell>
						<TableCell align="center">Point</TableCell>
						{!isStudent && (
							<TableCell align="center">Action</TableCell>
						)}
					</TableRow>
				</TableHead>
				<DragDropContext onDragEnd={handleOnDragEnd}>
					<Droppable droppableId="droppable" direction="vertical">
						{(droppableProvided) => (
							<TableBody
								ref={droppableProvided.innerRef}
								{...droppableProvided.droppableProps}
							>
								{items.map((item, index) => (
									<Draggable
										key={item.id ? item.id : item.name}
										draggableId={item.name}
										index={index}
									>
										{(draggableProvided, snapshot) => {
											return (
												<TableRow
													ref={
														draggableProvided.innerRef
													}
													{...draggableProvided.draggableProps}
													style={{
														...draggableProvided
															.draggableProps
															.style,
														background:
															snapshot.isDragging
																? "rgba(245,245,245, 0.75)"
																: "none",
													}}
												>
													<AssignmentRow
														index={index}
														item={item}
														onClickDelete={() =>
															onClickDelete(item)
														}
														onClickEdit={() =>
															onClickEdit(index)
														}
														draggableProvided={
															draggableProvided
														}
														onClickCancelEdit={() =>
															onClickCancelEdit(
																index
															)
														}
														onClickSaveEdit={
															onClickSaveEdit
														}
														isStudent={isStudent}
													/>
												</TableRow>
											);
										}}
									</Draggable>
								))}
								{droppableProvided.placeholder}
							</TableBody>
						)}
					</Droppable>
				</DragDropContext>{" "}
			</Table>
		</TableContainer>
	);
}
