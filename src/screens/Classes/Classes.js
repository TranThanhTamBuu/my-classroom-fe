import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Class } from "components";
import { useDispatch, useSelector } from "react-redux";
import { setClasses } from "actions/classes.action";
import { removeLinkId } from "actions/link.action";
import { useHistory } from "react-router";

export default function Classes() {
	const dispatch = useDispatch();
	const classes = useSelector((state) => state.classes);
	const token = useSelector((state) => state.link);
	const history = useHistory();

	useEffect(() => {
		if (token) {
			dispatch(removeLinkId());
			return history.go(-2);
		}
	}, [token]);

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
