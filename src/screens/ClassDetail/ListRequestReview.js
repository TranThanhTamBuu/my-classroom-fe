import React, { useEffect, useState } from "react";
import { useToggle } from "react-use";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import RequestReviewCard from "./RequestReviewCard";
import ClassesService from "services/classes.service";
import { useSelector } from "react-redux";

const Container = styled.div`
	width: 100%;
	display: flex;
	justify-content: start;
	align-items: center;
	flex-direction: column;
	margin-top: 2rem;
	gap: 2rem;
`;

export default function ListRequestReview(props) {
	const [loading, setLoading] = useToggle(true);
	const [state, setState] = useState([]);
	const user = useSelector((state) => state.user);
	const isTeacher = user.studentId === "";
	useEffect(() => {
		async function getData() {
			let listRequest = [];
			for (const item of props.gradeList) {
				const res = await ClassesService.getListReviewRequest(item.id);

				console.log(res);
				if (res.data && Object.keys(res.data).length !== 0) {
					if (isTeacher) {
						for (const [key, value] of Object.entries(res.data)) {
							listRequest.push({
								...value,
								name: item.name,
								id: item.id,
								maxPoint: item.maxPoint,
							});
						}
					} else
						listRequest.push({
							...res.data,
							name: item.name,
							id: item.id,
							maxPoint: item.maxPoint,
						});
				}
			}
			setState(listRequest);
			setLoading(false);
		}

		getData();
	}, []);
	console.log(state);

	if (loading)
		return (
			<Container>
				<CircularProgress />
			</Container>
		);
	return (
		<Container>
			<h2>List Request Review</h2>
			{state.map((item) => (
				<RequestReviewCard
					key={`${item.id}${item.name}`}
					content={item}
				/>
			))}
		</Container>
	);
}
