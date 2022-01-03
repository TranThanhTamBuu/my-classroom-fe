import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import LinkIcon from "@mui/icons-material/Link";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import * as Styled from "./Admin.styled";
import AuthService from "services/auth.service";
import EditIcon from "@mui/icons-material/Edit";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";
import {
	ModalCreateAdmin,
	ModalChangeStudentId,
	ModalConfirmation,
	EnhancedTableHead,
	EnhancedTableToolbar,
} from "components";
import { useToggle } from "react-use";
import { getComparator } from "utils/sort.util";
import dayjs from "dayjs";
import { useHistory } from "react-router";
import { RouteUrl } from "constants/router";

const headCells = [
	{
		id: "email",
		numeric: false,
		disablePadding: true,
		label: "Email",
	},
	{
		id: "name",
		numeric: false,
		disablePadding: false,
		label: "Name",
	},
	{
		id: "role",
		numeric: false,
		disablePadding: false,
		label: "Role",
	},
	{
		id: "studentId",
		numeric: false,
		disablePadding: false,
		label: "Student ID",
	},
	{
		id: "createdAt",
		numeric: false,
		disablePadding: false,
		label: "Created at",
	},
	{
		id: "active",
		numeric: false,
		disablePadding: false,
		label: "Status",
	},
	{
		id: "editStudentId",
		numeric: false,
		disablePadding: false,
		label: "",
	},
];

export default function UsersTable({ isAdmin }) {
	const [order, setOrder] = useState("desc");
	const [orderBy, setOrderBy] = useState("createdAt");
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [rows, setRows] = useState([]);
	const [modalCreateAdmin, toggleModalCreateAdmin] = useToggle(false);
	const [modalChangeStudentId, toggleModalChangeStudentId] = useToggle(false);
	const [modalChangeConfirmation, toggleModalChangeConfirmation] =
		useToggle(false);
	const [isActivate, setIsActivate] = useToggle(true);
	const [changeStudentIdOfUserId, setChangeStudentIdOfUserId] = useState("");
	const [loadingConfirmAction, setLoadingConfirmAction] = useState(false);
	const [search, setSearch] = useState("");
	const history = useHistory();

	const fetchData = async () => {
		const response = isAdmin
			? await AuthService.getAllAdmins()
			: await AuthService.getAllUsers();

		setRows(
			response.map((user) => ({
				userId: user._id,
				email: user.email,
				name: user.name,
				role: user.isAdmin
					? "Admin/Teacher"
					: !user.studentId
					? "Teacher"
					: "Student",
				studentId: user.studentId,
				active: user.active,
				createdAt: user.createdAt,
			}))
		);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n.userId);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, _id) => {
		const selectedIndex = selected.indexOf(_id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, _id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (_id) => selected.indexOf(_id) !== -1;

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	const onActivate = async () => {
		setIsActivate(true);
		toggleModalChangeConfirmation(true);
	};

	const onDeactivate = () => {
		setIsActivate(false);
		toggleModalChangeConfirmation(true);
	};

	const searchFilter = (row) => {
		if (!search) return true;
		else {
			const re = new RegExp(search, "i");
			return (
				row.name.search(re) !== -1 ||
				row.email.search(re) !== -1 ||
				row.studentId.search(re) !== -1
			);
		}
	};

	return (
		<>
			<Box sx={{ width: "100%", height: "100%" }}>
				<Paper sx={{ width: "100%", mb: 2 }}>
					<EnhancedTableToolbar
						title={isAdmin ? "All admins" : "All users"}
						numSelected={selected.length}
						rightComponent={
							<Styled.RightContainer>
								{isAdmin && (
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										sx={{ width: "180px" }}
										onClick={() =>
											toggleModalCreateAdmin(true)
										}
									>
										Create admin
									</Button>
								)}
								<Styled.Search>
									<Styled.SearchIconWrapper>
										<SearchIcon />
									</Styled.SearchIconWrapper>
									<Styled.StyledInputBase
										placeholder="Search…"
										inputProps={{ "aria-label": "search" }}
										value={search}
										onChange={(e) =>
											setSearch(e.target.value)
										}
									/>
								</Styled.Search>
							</Styled.RightContainer>
						}
						rightSelectedComponent={
							<Styled.ButtonContainer>
								<Button
									color="secondary"
									onClick={onDeactivate}
								>
									Deactivate
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={onActivate}
								>
									Activate
								</Button>
							</Styled.ButtonContainer>
						}
					/>
					<TableContainer>
						<Table
							sx={{ minWidth: 750 }}
							aria-labelledby="tableTitle"
							size="medium"
						>
							<EnhancedTableHead
								headCells={
									isAdmin
										? headCells.filter(
												(head) =>
													head.id !== "studentId"
										  )
										: headCells
								}
								numSelected={selected.length}
								order={order}
								orderBy={orderBy}
								onSelectAllClick={handleSelectAllClick}
								onRequestSort={handleRequestSort}
								rowCount={rows.length}
							/>
							<TableBody>
								{rows
									?.slice()
									.filter(searchFilter)
									.sort(getComparator(order, orderBy))
									.slice(
										page * rowsPerPage,
										page * rowsPerPage + rowsPerPage
									)
									.map((row, index) => {
										const isItemSelected = isSelected(
											row.userId
										);
										const labelId = `enhanced-table-checkbox-${index}`;

										return (
											<TableRow
												hover
												role="checkbox"
												aria-checked={isItemSelected}
												tabIndex={-1}
												key={row.userId}
												selected={isItemSelected}
											>
												<TableCell padding="checkbox">
													<Checkbox
														color="primary"
														onClick={(event) =>
															handleClick(
																event,
																row.userId
															)
														}
														checked={isItemSelected}
														inputProps={{
															"aria-labelledby":
																labelId,
														}}
													/>
												</TableCell>
												<TableCell
													component="th"
													id={labelId}
													scope="row"
													padding="none"
												>
													{row.email}
												</TableCell>
												<TableCell align="left">
													{row.name}
												</TableCell>
												<TableCell align="left">
													{row.role}
												</TableCell>
												{!isAdmin && (
													<TableCell align="left">
														{row.studentId || "-/-"}
													</TableCell>
												)}
												<TableCell align="left">
													{dayjs(
														row.createdAt
													).format(
														"HH:mm - MMM D, YYYY"
													)}
												</TableCell>
												<TableCell align="left">
													<Chip
														label={
															row.active
																? "Active"
																: "Disabled"
														}
														color={
															row.active
																? "success"
																: "error"
														}
														variant="outlined"
														sx={{ width: "80px" }}
													/>
												</TableCell>
												<TableCell align="right">
													<IconButton
														disabled={
															!row.studentId
														}
														onClick={() => {
															setChangeStudentIdOfUserId(
																row.userId
															);
															toggleModalChangeStudentId(
																true
															);
														}}
													>
														<EditIcon />
													</IconButton>
													<IconButton
														onClick={() => {}}
													>
														<LinkIcon />
													</IconButton>
												</TableCell>
											</TableRow>
										);
									})}
								{emptyRows > 0 && (
									<TableRow
										style={{
											height: 53 * emptyRows,
										}}
									>
										<TableCell colSpan={6} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={rows.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
			</Box>
			<ModalCreateAdmin
				open={modalCreateAdmin}
				onClose={() => {
					fetchData();
					toggleModalCreateAdmin(false);
				}}
			/>
			<ModalChangeStudentId
				open={modalChangeStudentId}
				onClose={() => {
					fetchData();
					toggleModalChangeStudentId(false);
				}}
				userId={changeStudentIdOfUserId}
			/>
			<ModalConfirmation
				open={modalChangeConfirmation}
				onClose={() => toggleModalChangeConfirmation(false)}
				onOk={async () => {
					setLoadingConfirmAction(true);
					await AuthService.toggleActive(selected, isActivate);
					setSelected([]);
					await fetchData();
					toggleModalChangeConfirmation(false);
					setLoadingConfirmAction(false);
				}}
				loading={loadingConfirmAction}
			/>
		</>
	);
}
