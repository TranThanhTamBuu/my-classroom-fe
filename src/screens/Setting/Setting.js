import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import * as Styled from "./Setting.styled";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import { AUTH_VALIDATION } from "constants/validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Styled.SettingContainer
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box
					sx={{
						height: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					{children}
				</Box>
			)}
		</Styled.SettingContainer>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		"aria-controls": `vertical-tabpanel-${index}`,
	};
}

export default function Setting() {
	const user = useSelector((state) => state.user);
	const [tabIndex, setTabIndex] = useState(0);

	const handleChange = (event, newValue) => {
		setTabIndex(newValue);
	};
	const editProfileSchema = yup.object().shape({
		email: yup
			.string()
			.trim()
			.email(AUTH_VALIDATION.ERROR_INVALID_EMAIL)
			.required(AUTH_VALIDATION.ERROR_EMAIL_IS_REQUIRED),
		name: yup
			.string()
			.trim()
			.required(AUTH_VALIDATION.ERROR_NAME_IS_REQUIRED),
		studentId: yup
			.string()
			.trim()
			.required(AUTH_VALIDATION.ERROR_STUDENT_ID_IS_REQUIRED),
	});
	const changePasswordSchema = yup.object().shape({
		oldPassword: yup
			.string()
			.trim()
			.required(AUTH_VALIDATION.ERROR_PASSWORD_IS_REQUIRED)
			.matches(
				AUTH_VALIDATION.PASSWORD_STRENGTH_REGEX,
				AUTH_VALIDATION.ERROR_PASSWORD_STRENGTH
			),
		newPassword: yup
			.string()
			.trim()
			.required(AUTH_VALIDATION.ERROR_PASSWORD_IS_REQUIRED)
			.matches(
				AUTH_VALIDATION.PASSWORD_STRENGTH_REGEX,
				AUTH_VALIDATION.ERROR_PASSWORD_STRENGTH
			),
		confirmPassword: yup
			.string()
			.trim()
			.required(AUTH_VALIDATION.ERROR_REPEAT_PASSWORD_IS_REQUIRED)
			.oneOf(
				[yup.ref("newPassword"), null],
				AUTH_VALIDATION.ERROR_PASSWORD_MATCHED
			),
	});

	const {
		register,
		handleSubmit,
		formState: { isValid, isSubmitting, errors },
	} = useForm({
		mode: "onTouched",
		reValidateMode: "onChange",
		defaultValues:
			tabIndex === 0
				? {
						name: user.name,
						studentId: user.studentId,
				  }
				: {
						confirmPassword: "",
						newPassword: "",
						oldPassword: "",
				  },
		resolver: yupResolver(
			tabIndex === 0 ? editProfileSchema : changePasswordSchema
		),
	});

	const onSubmit = async (data) => {
		// const response = await AuthService.signIn(data);
		// if (response.statusCode) {
		// 	setServerError(
		// 		response.statusCode === AUTH_VALIDATION.CODE_UNAUTHORIZED
		// 			? AUTH_VALIDATION.ERROR_SIGN_IN_FAILED
		// 			: AUTH_VALIDATION.INTERNAL_ERROR
		// 	);
		// } else {
		// 	localStorage.setItem(
		// 		LOCAL_STORAGE_KEY.ACCESS_TOKEN,
		// 		response.accessToken
		// 	);
		// 	dispatch(initUser());
		// }
	};

	return (
		<Box
			sx={{
				bgcolor: "background.paper",
				display: "flex",
				height: "80vh",
			}}
		>
			<Tabs
				orientation="vertical"
				value={tabIndex}
				onChange={handleChange}
				aria-label="Vertical tabs example"
				sx={{ borderRight: 1, borderColor: "divider" }}
			>
				<Tab label="User Info" {...a11yProps(0)} />
				<Tab label="Change Password" {...a11yProps(1)} />
			</Tabs>
			<TabPanel value={tabIndex} index={0}>
				<Typography variant="h4" align="center">
					Profiles
				</Typography>
				<Typography variant="h5" align="center">
					Add information about yourself
				</Typography>
				<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
					<TextField
						margin="normal"
						id="studentId"
						label="Student ID"
						type="text"
						fullWidth
						variant="outlined"
						{...register("studentId")}
						helperText={errors.studentId?.message}
						error={errors.studentId?.message ? true : false}
					/>
					<TextField
						margin="normal"
						id="name"
						label="Full Name"
						type="text"
						fullWidth
						variant="outlined"
						{...register("name")}
						helperText={errors.name?.message}
						error={errors.name?.message ? true : false}
					/>
					<Box sx={{ flexGrow: 3 }} />
					<LoadingButton
						color="primary"
						type="submit"
						loadingPosition="center"
						loading={isSubmitting}
						disabled={!isValid}
						variant="contained"
						size="large"
						sx={{
							width: "20%",
							mt: 5,
						}}
					>
						<Typography variant="h6" sx={{ fontWeight: "bold" }}>
							Save
						</Typography>
					</LoadingButton>
				</form>
				<Box sx={{ flexGrow: 1 }} />
			</TabPanel>
			<TabPanel value={tabIndex} index={1}>
				<Typography variant="h4" align="center">
					Change password
				</Typography>
				<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
					<TextField
						margin="normal"
						id="oldPassword"
						label="Old Password"
						type="password"
						fullWidth
						variant="outlined"
						{...register("oldPassword")}
						helperText={errors.oldPassword?.message}
						error={errors.oldPassword?.message ? true : false}
					/>
					<TextField
						margin="normal"
						id="newPassword"
						label="New Password"
						type="password"
						fullWidth
						variant="outlined"
						{...register("newPassword")}
						helperText={errors.newPassword?.message}
						error={errors.newPassword?.message ? true : false}
					/>
					<TextField
						margin="normal"
						id="confirmPassword"
						label="Confirm Password"
						type="password"
						fullWidth
						variant="outlined"
						{...register("Password")}
						helperText={errors.confirmPassword?.message}
						error={errors.confirmPassword?.message ? true : false}
					/>
					<Box sx={{ flexGrow: 3 }} />
					<LoadingButton
						color="primary"
						type="submit"
						loadingPosition="center"
						variant="contained"
						loading={isSubmitting}
						disabled={!isValid}
						size="large"
						sx={{
							width: "20%",
							mt: 5,
						}}
					>
						<Typography variant="h6" sx={{ fontWeight: "bold" }}>
							Save
						</Typography>
					</LoadingButton>
				</form>
			</TabPanel>
		</Box>
	);
}
