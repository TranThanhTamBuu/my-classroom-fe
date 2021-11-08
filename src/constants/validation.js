const getIsRequiredMessage = (field) => `${field} must not be empty`;

export const AUTH_VALIDATION = {
	ERROR_INVALID_EMAIL: "Email is invalid.",
	ERROR_EMAIL_IS_REQUIRED: getIsRequiredMessage("Email"),
	ERROR_PASSWORD_IS_REQUIRED: getIsRequiredMessage("Password"),
	PASSWORD_STRENGTH_REGEX:
		/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
	ERROR_PASSWORD_STRENGTH:
		"Password must have one uppercase, lowercase, number and special character.",
	ERROR_REPEAT_PASSWORD_IS_REQUIRED: getIsRequiredMessage("Confirm password"),
	ERROR_PASSWORD_MATCHED: "Confirm password must match.",
	ERROR_NAME_IS_REQUIRED: getIsRequiredMessage("Full name"),
	ERROR_STUDENT_ID_IS_REQUIRED: getIsRequiredMessage("Student ID"),
	ERROR_SIGN_IN_FAILED: "Email or Password does not match.",
	INTERNAL_ERROR: "Something went wrong. Please try again.",
	CODE_UNAUTHORIZED: 401,
	CODE_CONFLICT: 409,
	ERROR_THIRD_PARTY_CREDENTIAL: "This email has not been signed up.",
};
