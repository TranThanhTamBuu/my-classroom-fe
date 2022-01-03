import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
import { useToggle } from "react-use";
import { showSnackbar } from "actions/snackbar.action";

export default function ModalSetFinalGrade({
	open,
	onClose,
	studentId,
	state,
	setState,
}) {
	const [isLoading, setLoading] = useToggle(false);
	const dispatch = useDispatch();
	let schema = yup.object().shape({
		point: yup
			.number()
			.required("Point is required")
			.positive("Point must be positive")
			.max(state.maxPoint),
	});

	const {
		register,
		getValues,
		formState: { isValid, errors },
	} = useForm({
		mode: "onChange",
		defaultValues: { point: state.currentGrade },
		resolver: yupResolver(schema),
	});

	const onClickSave = async () => {
		setLoading(true);
		const data = {
			studentId: studentId,
			assignmentId: state.id,
			newGrade: getValues("point"),
			markAsFinal: true,
		};
		ClassesService.teacherComment(data)
			.then(() => {
				setState({ ...state, isFinal: true });
			})
			.catch((err) => {
				dispatch(showSnackbar(String(err)));
			})
			.finally(() => {
				setLoading(false);
				onClose();
			});
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"md"}>
			<DialogTitle>Set final point for review request</DialogTitle>
			<DialogContent>
				<TextField
					inputProps={{ min: 0, max: parseInt(state.maxPoint) }}
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
						e.target.value =
							parseInt(e.target.value) > state.maxPoint
								? state.maxPoint
								: e.target.value;
					}}
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
