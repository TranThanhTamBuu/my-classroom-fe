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
import Button from "@mui/material/Button";
import * as Styled from "./Admin.styled";
import {
	ModalConfirmation,
	EnhancedTableHead,
	EnhancedTableToolbar,
} from "components";
import { useToggle } from "react-use";
import { getComparator } from "utils/sort.util";
import ClassesService from "services/classes.service";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import LinkIcon from "@mui/icons-material/Link";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";

const headCells = [
	{
		id: "name",
		numeric: false,
		disablePadding: true,
		label: "Name",
	},
	{
		id: "subject",
		numeric: false,
		disablePadding: false,
		label: "Subject",
	},
	{
		id: "section",
		numeric: false,
		disablePadding: false,
		label: "Section",
	},
	{
		id: "room",
		numeric: false,
		disablePadding: false,
		label: "Room",
	},
	{
		id: "createdBy",
		numeric: false,
		disablePadding: false,
		label: "Created by",
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
		id: "util",
		numeric: false,
		disablePadding: false,
		label: "",
	},
];

export default function ClassesTable() {
	const [order, setOrder] = useState("desc");
	const [orderBy, setOrderBy] = useState("createdAt");
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [rows, setRows] = useState([]);
	const [modalChangeConfirmation, toggleModalChangeConfirmation] =
		useToggle(false);
	const [isActivate, setIsActivate] = useToggle(true);
	const [loadingConfirmAction, setLoadingConfirmAction] = useState(false);
	const [search, setSearch] = useState("");

	const fetchData = async () => {
		const response = await ClassesService.getAllClasses();
		setRows(
			response.map((aClass) => ({
				classId: aClass._id,
				name: aClass.name,
				subject: aClass.subject,
				section: aClass.section,
				room: aClass.room,
				createdBy: aClass.createdBy,
				active: aClass.active,
				createdAt: aClass.createdAt,
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
			const newSelecteds = rows.map((n) => n.classId);
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
				row.subject?.search(re) !== -1 ||
				row.section?.search(re) !== -1 ||
				row.room?.search(re) !== -1 ||
				row.createdBy.search(re) !== -1
			);
		}
	};

	return (
		<>
			<Box sx={{ width: "100%", height: "100%" }}>
				<Paper sx={{ width: "100%", mb: 2 }}>
					<EnhancedTableToolbar
						title="All classes"
						numSelected={selected.length}
						rightComponent={
							<Styled.RightContainer>
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
								headCells={headCells}
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
											row.classId
										);
										const labelId = `enhanced-table-checkbox-${index}`;

										return (
											<TableRow
												hover
												role="checkbox"
												aria-checked={isItemSelected}
												tabIndex={-1}
												key={row.classId}
												selected={isItemSelected}
											>
												<TableCell padding="checkbox">
													<Checkbox
														color="primary"
														onClick={(event) =>
															handleClick(
																event,
																row.classId
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
													{row.name || "-/-"}
												</TableCell>
												<TableCell align="left">
													{row.subject || "-/-"}
												</TableCell>
												<TableCell align="left">
													{row.section || "-/-"}
												</TableCell>
												<TableCell align="left">
													{row.room || "-/-"}
												</TableCell>
												<TableCell align="left">
													{row.createdBy || "-/-"}
												</TableCell>
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
			<ModalConfirmation
				open={modalChangeConfirmation}
				onClose={() => toggleModalChangeConfirmation(false)}
				onOk={async () => {
					setLoadingConfirmAction(true);
					await ClassesService.toggleActive(selected, isActivate);
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
