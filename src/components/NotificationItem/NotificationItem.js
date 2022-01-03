import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import BaseBadge from "@mui/material/Badge";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const DescriptionBadge = styled(BaseBadge)(() => ({
	"& .MuiBadge-badge": {
		right: "12px",
		top: "50%",
		padding: "0 4px",
	},
}));

export default function NotificationItem({
	receivedFromUser,
	description,
	createdAt,
	isRead,
	readNotification,
}) {
	return (
		<Tooltip
			arrow
			title={
				<React.Fragment>
					<Typography
						sx={{
							fontSize: "12px",
						}}
					>
						<b>{receivedFromUser.name}:</b> {description}
					</Typography>
				</React.Fragment>
			}
		>
			<MenuItem
				onClick={() => {
					if (!isRead) readNotification();
				}}
			>
				<DescriptionBadge
					color="secondary"
					variant="dot"
					sx={{
						width: "100%",
					}}
					invisible={isRead}
				>
					<Stack
						direction="row"
						alignItems="center"
						sx={{
							width: "100%",
							overflow: "hidden",
						}}
					>
						<Avatar src={receivedFromUser.photo} />
						<Stack
							sx={{
								marginLeft: "8px",
								justifyContent: "space-between",
								height: "36px",
								width: "75%",
							}}
						>
							<Typography
								noWrap={true}
								sx={{
									fontSize: "12px",
								}}
							>
								<b>{receivedFromUser.name}:</b> {description}
							</Typography>
							<Typography
								color="secondary"
								sx={{
									fontSize: "10px",
								}}
							>
								{dayjs(createdAt).fromNow()}
							</Typography>
						</Stack>
					</Stack>
				</DescriptionBadge>
			</MenuItem>
		</Tooltip>
	);
}
