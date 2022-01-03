import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import ClassesService from "services/classes.service";
import { useParams } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import { useToggle } from "react-use";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function ModalFinalizeGrade({ open, onClose, gradeList,setGradeBoard }) {
	const [state, setState] = useState(gradeList);
	const [isLoading, setLoading] = useToggle(false);
	let listItems = [];
	for (const [key, value] of Object.entries(state)) {
		listItems.push({
			name: key,
			maxPoint: value.point,
			id: value.id,
			position: value.index,
			isFinalized: value.isFinalized,
		});
	}

	const handleChange = async (event) => {
		setLoading(true);

		let copyState = JSON.parse(JSON.stringify(state));
		const isFinalized = event.target.checked;
		if (event.target.checked)
			await ClassesService.markFinalizedGrade(event.target.id);
		else await ClassesService.unmarkFinalizedGrade(event.target.id);
		copyState[event.target.name].isFinalized = isFinalized;
		setGradeBoard();
		setLoading(false);
		setState({
			...copyState,
		});
	};

	return (
		<Dialog open={open} fullWidth={true} maxWidth={"sm"}>
			<DialogTitle>Finalize grade</DialogTitle>
			<DialogContent>
				<FormControl
					sx={{ m: 3 }}
					component="fieldset"
					variant="standard"
				>
					<FormGroup>
						{listItems
							.sort((a, b) => a.position - b.position)
							.map((item) => (
								<FormControlLabel
									key={item.id}
									control={
										<Checkbox
											checked={item.isFinalized}
											onChange={handleChange}
											name={item.name}
											id={item.id}
										/>
									}
									label={item.name}
								/>
							))}
					</FormGroup>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<LoadingButton
					loading={isLoading}
					loadingPosition="center"
					variant="button"
					onClick={onClose}
					disabled={isLoading}
				>
					<Typography variant="button">Close</Typography>
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
