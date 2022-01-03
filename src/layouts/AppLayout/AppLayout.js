import React from "react";
import * as Styled from "./AppLayout.styled";
import { ErrorSnackbar, MyAppBar, MyDrawer } from "components";
import { useToggle } from "react-use";

export default function AppLayout({ children }) {
	const [drawer, toggleDrawer] = useToggle(false);
	return (
		<Styled.Wrapper>
			<MyDrawer open={drawer} onClose={() => toggleDrawer(false)} />
			<MyAppBar openDrawer={() => toggleDrawer(true)} />
			<Styled.MyContainer disableGutters>{children}</Styled.MyContainer>
			<ErrorSnackbar />
		</Styled.Wrapper>
	);
}
