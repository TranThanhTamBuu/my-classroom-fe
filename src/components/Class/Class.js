import React from "react";
import Card from "@mui/material/Card";
import * as Styled from "./Class.styled";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Divider from "@mui/material/Divider";
import Box from "@mui/system/Box";
import { MyTooltip } from "components";
import { RouteUrl } from "constants/router";

export default function Class({ item }) {
	const { name, teacher,_id } = item;
	return (
		<Card
			variant="outlined"
			sx={{
				position: "relative",
				height: "300px",
				padding: "16px",
			}}
		>
			<Styled.HeaderWrapper>
				<Styled.MyContainer>
					<Styled.TitleContainer>
					<Styled.Link to={RouteUrl.CLASS + `/${_id}`}>
							{name}
						</Styled.Link>
						<IconButton
							size="medium"
							sx={{
								color: "white",
								position: "absolute",
								right: "8px",
								top: "12px",
							}}
							aria-label="more"
						>
							<MoreVertIcon />
						</IconButton>
					</Styled.TitleContainer>
					<Typography
						color="white"
						noWrap
						variant="caption"
						sx={{ width: "50%" }}
					>
						{teacher}
					</Typography>
				</Styled.MyContainer>
				<Avatar
					sx={{
						width: 76,
						height: 76,
						position: "absolute",
						bottom: -38,
						right: 16,
					}}
				/>
			</Styled.HeaderWrapper>
			<Styled.MyContainer>
				<CardContent
					sx={{
						width: "80%",
						marginTop: "84px",
						padding: "16px 0 16px 0",
					}}
				>
					<Typography variant="body2" color="text.secondary" noWrap>
						Due Wednesday
					</Typography>
					<Typography
						variant="body2"
						color="text.primary"
						sx={{
							":hover": {
								textDecoration: "underline",
								cursor: "pointer",
							},
						}}
						noWrap
					>
						10:00 PM – BTCN03 - Listing and creating classes
					</Typography>
				</CardContent>
				<Box sx={{ width: "calc(100% + 32px)", marginLeft: "-16px" }}>
					<Divider />
					<CardActions
						sx={{
							marginBottom: "-16px",
							display: "flex",
							justifyContent: "end",
						}}
					>
						<MyTooltip title={`Open your work for "${name}"`}>
							<IconButton size="medium" aria-label="add">
								<AssignmentIndIcon />
							</IconButton>
						</MyTooltip>
						<MyTooltip
							title={`Open folder for "${name}" in Google Drive`}
						>
							<IconButton size="medium" aria-label="add">
								<FolderOpenIcon />
							</IconButton>
						</MyTooltip>
					</CardActions>
				</Box>
			</Styled.MyContainer>
		</Card>
	);
}
