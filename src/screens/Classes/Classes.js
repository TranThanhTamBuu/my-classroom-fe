import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Class } from "components";
import { useDispatch, useSelector } from "react-redux";
import { setClasses } from "actions/classes.action";

export default function Classes() {
	const dispatch = useDispatch();
	const classes = useSelector((state) => state.classes);

	useEffect(() => {
		dispatch(setClasses());
	}, []);

	return (
		<Grid container spacing={3}>
			{classes?.map((item) => (
				<Grid item key={item._id} xs={6} md={4} lg={3}>
					<Class item={item} />
				</Grid>
			))}
		</Grid>
	);
}
