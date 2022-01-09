import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import ClassesService from "services/classes.service";
import { useSelector } from "react-redux";
import AssignmentTable from "../AssignmentTable";
import { useToggle } from "react-use";
import CircularProgress from "@mui/material/CircularProgress";

import { showSnackbar } from "actions/snackbar.action";
let schema = yup.object().shape({
	name: yup.string().trim().required("Name must not be empty"),
	point: yup
		.number()
		.required("Point is required")
		.positive("Point must be positive"),
});

export default function ModalClassGrade({ id, isStudent, getGradeboard }) {
	const [listGrade, setListGrade] = useState([]);
	const dispatch = useDispatch();
	const [isLoading, setLoading] = useToggle(false);
	const user = useSelector((state) => state.user);
	const {
		register,
		setValue,
		getValues,
		formState: { isValid, errors },
	} = useForm({
		mode: "onChange",
		defaultValues: { name: "", point: 0 },
		resolver: yupResolver(schema),
	});
	let defaultGradeStructure = [];
	useEffect(() => {
		async function getAssignment() {
			let listAssignment = await ClassesService.getAllAssignments(id);
			console.log(listAssignment);
			listAssignment = listAssignment
				.sort((a, b) => a.position - b.position)
				.map((e) => {
					return { name: e.title, point: e.totalPoint, id: e._id };
				});
			defaultGradeStructure = listAssignment.slice();
			setListGrade(listAssignment);
		}
		getAssignment();
	}, []);

	const onClickAdd = () => {
		const point = getValues("point").replace(
			/^0+(?!\.)|(?:\.|(\..*?))0+$/gm,
			"$1"
		);
		const name = getValues("name");
		setListGrade([...listGrade, { point, name, isEditMode: false }]);
		setValue("point", "0");
		setValue("name", "");
	};

	const onClickDelete = (grade) => {
		const listGradeCopy = listGrade.slice();
		console.log(listGradeCopy);
		setListGrade(listGradeCopy.filter((e) => e !== grade));
	};
	const onClickEdit = (index) => {
		const listGradeCopy = listGrade.slice();
		let editedRow = listGradeCopy[index];
		editedRow["isEditMode"] = true;
		setListGrade(
			listGradeCopy.map((e, i) => (index === i ? editedRow : e))
		);
	};
	const onClickCancelEdit = (index) => {
		const listGradeCopy = listGrade.slice();
		let editedRow = listGradeCopy[index];
		editedRow["isEditMode"] = false;
		setListGrade(
			listGradeCopy.map((e, i) => (index === i ? editedRow : e))
		);
	};
	const onClickSaveEdit = (index, newValue) => {
		const listGradeCopy = listGrade.slice();
		let editedRow = listGradeCopy[index];
		editedRow["isEditMode"] = false;
		editedRow["name"] = newValue.name;
		editedRow["point"] = newValue.point;

		setListGrade(
			listGradeCopy.map((e, i) => (index === i ? editedRow : e))
		);
	};
	const onClickSave = async () => {
		setLoading(true);
		const listGradeCopy = listGrade.slice();
		const data = {
			classId: id,
			listAssignment: listGradeCopy.map((e, index) => {
				return {
					title: e.name,
					totalPoint: e.point,
					_id: e.id,
					position: index,
				};
			}),
		};
		try {
			await ClassesService.updateAssignment(data);
			await getGradeboard();
		} catch (err) {
			dispatch(showSnackbar(String(err)));
		} finally {
			setLoading(false);
		}
	};
	const handleOnDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(listGrade);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setListGrade(items);
	};

	return (
		// <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"md"}>
		// 	<DialogTitle>Join class</DialogTitle>
		<div>
			<div>
				{listGrade.length > 0 ? (
					<>
						<AssignmentTable
							onClickDelete={onClickDelete}
							items={listGrade}
							setItem={setListGrade}
							onClickEdit={onClickEdit}
							onClickCancelEdit={onClickCancelEdit}
							onClickSaveEdit={onClickSaveEdit}
							handleOnDragEnd={handleOnDragEnd}
							isTeacher={!isStudent}
						/>
						{!isStudent && (
							<>
								<TextField
									autoFocus
									margin="dense"
									id="name"
									label="Name"
									type="text"
									fullWidth
									variant="filled"
									{...register("name")}
									helperText={errors.name?.message}
									error={errors.name?.message ? true : false}
								/>
								<TextField
									margin="dense"
									id="point"
									label="Point"
									type="number"
									fullWidth
									variant="filled"
									{...register("point")}
									helperText={errors.point?.message}
									error={errors.point?.message ? true : false}
								/>
							</>
						)}
					</>
				) : (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<CircularProgress />
					</div>
				)}
			</div>
			<div>
				{!isStudent && (
					<>
						<Button
							disabled={!isValid}
							onClick={onClickAdd}
							variant="contained"
							sx={{ mr: 2 }}
						>
							<Typography variant="button">Add</Typography>
						</Button>
						<LoadingButton
							loading={isLoading}
							loadingPosition="center"
							variant="contained"
							disabled={
								(defaultGradeStructure.length &&
									listGrade.length === 0) ||
								listGrade.some((e) => e.isEditMode === true)
							}
							onClick={onClickSave}
						>
							<Typography variant="button">Save</Typography>
						</LoadingButton>
					</>
				)}
			</div>
		</div>
		// </Dialog>
	);
}
