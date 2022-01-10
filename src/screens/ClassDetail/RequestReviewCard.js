import React, { useState } from "react";
import { useToggle } from "react-use";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import OutlinedInput from "@mui/material/OutlinedInput";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";
import { styled as styledMUI } from "@mui/material/styles";
import { useSelector } from "react-redux";
import ClassesService from "services/classes.service";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import ModalSetFinalGrade from "./ModalSetFinalGrade";
import { showSnackbar } from "actions/snackbar.action";
const Card = styled.div`
	background: #fff;
	border-radius: 2rem;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	width: 500px;
	padding: 1rem;

	& > p {
		word-wrap: break-word;
		margin: 6px 0;
	}
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: start;

	& > *:last-child {
		display: flex;
		gap: 0.75rem;
	}
`;
const User = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;

	& > *:last-child > * {
		margin-bottom: 0;
		margin-top: 0;
	}
	& > *:last-child > *:last-child {
		font-size: 0.75rem;
	}
`;

const Status = styled.div`
	border-radius: 2rem;
	background: ${(props) => (props.isFinal ? "#65C3C8" : "#EEAF3A")};
	color: #fff;
	font-weight: 600;
	padding: 0.5rem;
`;

const Comment = styled.div`
	background-color: #e4e6eb;
	border-radius: 2rem;
	padding: 0.25rem 0.5rem;
	margin-bottom: 1rem;
	& > p {
		margin: 8px;
	}
	& > p:first-child {
		font-size: 0.75rem;
		margin-bottom: 5px;
		font-weight: 600;
		font-decoration: underline;
	}
	& > p:last-child {
		margin-top: 0;
		margin-bottm: 4px;
		font-size: 0.875rem;
		word-wrap: break-word;
	}
`;

const Input = styledMUI(OutlinedInput)`
	border-radius: 2rem;
	
    & > input{
        padding-top: 4px;
        padding-bottom:4px;
        min-height: 20px;
    }

`;

let schema = yup.object().shape({
	comment: yup.string().trim().required(),
});

export default function RequestReviewCard(props) {
	const dispatch = useDispatch();
	const [loading, setLoading] = useToggle(false);
	const [openModal, setModal] = useToggle(false);
	const classDetail = useSelector((state) => state.classDetail);
	const [state, setState] = useState(props.content);
	const user = useSelector((state) => state.user);
	const isTeacher = !user.studentId;
	const author = classDetail.students.find(
		(student) => student.studentId === state.studentId
	);
	const canComment = props.isTeacher || !!user.studentId;
	console.log(state);
	let studentComment = state.studentComment;
	let listComment = [
		...studentComment
			.filter((item, index) => index !== 0)
			.map((comment) => {
				return { ...comment, name: author.name };
			}),
		...state.teacherComment.map((comment) => {
			const teacher = classDetail.teachers.find(
				(teacher) => teacher._id === comment.teacherId
			);
			return {
				...comment,
				name: teacher.name,
			};
		}),
	];
	listComment.sort((a, b) => a.time - b.time);
	const {
		register,
		reset,
		getValues,
		formState: { isValid },
	} = useForm({
		mode: "onChange",
		defaultValues: { comment: "" },
		resolver: yupResolver(schema),
	});

	const handleComment = async () => {
		setLoading(true);
		const comment = getValues("comment");
		if (isTeacher) {
			const body = {
				comment: comment,
				studentId: author.studentId,
				assignmentId: state.id,
			};
			try {
				let res = await ClassesService.teacherComment(body);
				let newList = state.teacherComment.slice();
				newList.push({
					comment: comment,
					time: Math.floor(Date.now() / 1000),
					teacherId: user._id,
				});
				setState({ ...state, teacherComment: newList });
			} catch (err) {
				dispatch(showSnackbar(String(err)));
			}
		} else {
			const body = {
				studentComment: comment,
				assignmentId: state.id,
			};
			try {
				let res = await ClassesService.studentComment(body);
				let newList = state.studentComment.slice();
				newList.push({
					comment: comment,
					time: Math.floor(Date.now() / 1000),
				});
				setState({ ...state, studentComment: newList });
			} catch (err) {
				dispatch(showSnackbar(String(err)));
			}
		}
		reset();
		setLoading(false);
	};

	return (
		<>
			<Card>
				<Header>
					<User>
						<Avatar {...stringAvatar(author.name)} />
						<div>
							<p>{author.name}</p>
							<p>{author.studentId}</p>
						</div>
					</User>
					<div>
						<Status isFinal={state.isFinal}>
							{state.isFinal ? "Finished" : "Pending"}
						</Status>
						{!state.isFinal && isTeacher && (
							<IconButton
								aria-label="delete"
								onClick={() => {
									setModal(true);
								}}
							>
								<SettingsIcon />
							</IconButton>
						)}
					</div>
				</Header>
				<p>
					{"Grade composition: "}
					<b>{state.name}</b>
				</p>
				<p>
					{"Student grade: "}
					<b>{state.currentGrade}</b>
				</p>
				<p>
					{"Expected grade: "}
					<b>{state.expectedGrade}</b>
				</p>
				<p>{`Explain: ${studentComment[0].comment}`}</p>
				{canComment && !state.isFinal && (
					<>
						<hr />

						<Input
							sx={{ py: "8px" }}
							fullWidth
							{...register("comment")}
							endAdornment={
								<InputAdornment position="end">
									<LoadingButton
										disabled={!isValid}
										loading={loading}
										loadingPosition="center"
										variant="button"
										sx={{ width: 24, minWidth: 24 }}
										onClick={handleComment}
									>
										<SendIcon />
									</LoadingButton>
								</InputAdornment>
							}
						/>
					</>
				)}
				<hr />

				{listComment.map((comment, index) => (
					<Comment key={`${comment.name}${index}`}>
						<p>{comment.name}</p>
						<p>{comment.comment}</p>
					</Comment>
				))}
			</Card>
			<ModalSetFinalGrade
				open={openModal}
				onClose={() => {
					setModal(false);
				}}
				studentId={author.studentId}
				setState={setState}
				state={state}
			/>
		</>
	);
}
function stringToColor(string) {
	let hash = 0;
	let i;

	/* eslint-disable no-bitwise */
	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.substr(-2);
	}
	/* eslint-enable no-bitwise */

	return color;
}

function stringAvatar(name) {
	let word = name.split(" ");
	return {
		sx: {
			bgcolor: stringToColor(name),
		},
		children: `${word[0][0]}${word[word.length - 1][0]}`,
	};
}
