import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
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
import { useParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useToggle } from "react-use";

export default function ModalRequestReview({ open, onClose, gradeList }) {
	const [grade, setGrade] = React.useState();
	const [isLoading, setLoading] = useToggle(false);
	const { id } = useParams();

	let schema = yup.object().shape({
		explain: yup.string().trim().required("Explain must not be empty"),
		point: yup
			.number()
			.required("Point is required")
			.positive("Point must be positive")
			.max(grade ? grade.maxPoint : 100),
	});
	const handleChange = (event) => {
		setGrade(event.target.value);
	};

	const {
		register,
		getValues,
		formState: { isValid, errors },
	} = useForm({
		mode: "onChange",
		defaultValues: { explain: "", point: 0 },
		resolver: yupResolver(schema),
	});

	const onClickSave = async () => {
		setLoading(true);
		const data = {
			assignmentId: grade.id,
			studentComment: getValues("explain"),
			expectedGrade: getValues("point"),
		};
		const res = await ClassesService.requestReview(data);
		console.log(res);
		setLoading(false);
		onClose();
		window.location.reload(false);
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"md"}>
			<DialogTitle>Request review</DialogTitle>
			<DialogContent>
				<FormControl fullWidth margin="dense" variant="filled">
					<InputLabel>Grade Composition</InputLabel>
					<Select
						labelId="-select-label"
						id="select"
						value={grade}
						label="Grade Composition"
						onChange={handleChange}
					>
						{gradeList
							.filter(
								(item) =>
									item.isFinalized && !item.isReviewRequest
							)
							.map((item) => (
								<MenuItem value={item} key={item.name}>
									{item.name}
								</MenuItem>
							))}
					</Select>
				</FormControl>
				<TextField
					{...(!grade && { disabled: true })}
					{...(grade && {
						inputProps: { min: 0, max: parseInt(grade.maxPoint) },
					})}
					margin="dense"
					id="point"
					label="Point"
					type="number"
					fullWidth
					variant="filled"
					{...register("point")}
					helperText={errors.comment?.message}
					error={errors.point?.message ? true : false}
					onChange={(e) => {
						e.target.value = e.target.value.replace(
							/^0+(?!\.)|(?:\.|(\..*?))0+$/gm,
							"$1"
						);
						console.log(e.target.value);
						e.target.value =
							parseInt(e.target.value) > grade.maxPoint
								? grade.maxPoint
								: e.target.value;
					}}
				/>
				<TextField
					autoFocus
					margin="dense"
					id="explain"
					label="Explain"
					type="text"
					fullWidth
					variant="filled"
					{...register("explain")}
					helperText={errors.name?.message}
					error={errors.name?.message ? true : false}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>
					<Typography variant="button">{"Cancel"}</Typography>
				</Button>
				<LoadingButton
					loading={isLoading}
					loadingPosition="center"
					variant="button"
					disabled={!isValid}
					onClick={onClickSave}
				>
					<Typography variant="button">Request</Typography>
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
