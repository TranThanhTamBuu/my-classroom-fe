import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ReorderIcon from "@mui/icons-material/Reorder";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/DoneAllTwoTone";
import RevertIcon from "@mui/icons-material/NotInterestedOutlined";
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";

const NameCell = ({ isEditMode, name, handleChange }) => {
	return (
		<TableCell align="left">
			{isEditMode ? (
				<TextField
					value={name}
					name="name"
					onChange={handleChange}
					{...(name.length === 0 && {
						error: "error",
						helperText: "Name must no be empty",
					})}
				/>
			) : (
				name
			)}
		</TableCell>
	);
};
const ActionCell = ({
	isEditMode,
	draggableProvided,
	isValid,
	onClickCancelEdit,
	onClickSaveEdit,
}) => {
	return (
		<TableCell align="center">
			{isEditMode ? (
				<>
					<IconButton
						edge="end"
						aria-label="done"
						onClick={onClickSaveEdit}
						{...(!isValid && { disabled: true })}
					>
						<DoneIcon />
					</IconButton>
					<IconButton aria-label="revert" onClick={onClickCancelEdit}>
						<RevertIcon />
					</IconButton>
				</>
			) : (
				<div {...draggableProvided.dragHandleProps}>
					<ReorderIcon />
				</div>
			)}
		</TableCell>
	);
};
const PointCell = ({ isEditMode, point, handleChange }) => {
	return (
		<TableCell align="center">
			{isEditMode ? (
				<TextField
					value={point}
					name="Point"
					onChange={handleChange}
					type="number"
					{...(point <= 0 && {
						error: "error",
						helperText: "Point must be large than 0",
					})}
				/>
			) : (
				point
			)}
		</TableCell>
	);
};
export default function AssignmentRow({
	index,
	item,
	onClickDelete,
	onClickEdit,
	draggableProvided,
	onClickCancelEdit,
	onClickSaveEdit,
	isStudent
}) {
	const [name, setName] = useState(item.name);
	const handleNameChange = (event) => {
		setName(event.target.value);
	};
	const [point, setPoint] = useState(item.point);
	const handlePointChange = (event) => {
		setPoint(event.target.value);
	};
	const handleRevertEdit = () => {
		setPoint(item.point);
		setName(item.name);
		onClickCancelEdit();
	};
	const handleSaveEdit = () => {
		onClickSaveEdit(index, { name, point, isEditMode: false });
	};

	return (
		<>
			{!isStudent &&<ActionCell
				isEditMode={item.isEditMode}
				draggableProvided={draggableProvided}
				isValid={name.length > 0 && point > 0}
				onClickCancelEdit={handleRevertEdit}
				onClickSaveEdit={handleSaveEdit}
			/>}
			<NameCell
				name={name}
				handleChange={handleNameChange}
				isEditMode={item.isEditMode}
			/>
			<PointCell
				point={point}
				handleChange={handlePointChange}
				isEditMode={item.isEditMode}
			/>
			{!isStudent &&<TableCell align="center">
				<IconButton
					edge="end"
					aria-label="edit"
					onClick={onClickEdit}
					{...(item.isEditMode && { disabled: true })}
				>
					<EditIcon />
				</IconButton>
				<IconButton
					edge="end"
					aria-label="delete"
					onClick={onClickDelete}
				>
					<DeleteIcon />
				</IconButton>
			</TableCell>}
		</>
	);
}
