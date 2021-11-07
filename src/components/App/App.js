import React, { useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { indigo, pink } from "@mui/material/colors";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initUser } from "actions/user.action";
import AppRouter from "navigation";

const theme = createTheme({
	typography: {
		fontFamily: "Nunito",
	},
	palette: {
		primary: indigo,
		secondary: pink,
	},
});

export default function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(initUser());
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<AppRouter />
			</Router>
		</ThemeProvider>
	);
}
