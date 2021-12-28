import React, { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import AuthService from "services/auth.service";
import EditIcon from "@mui/icons-material/Edit";
import { ModalCreateAdmin, ModalChangeStudentId } from "components";
import { useToggle } from "react-use";

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

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
		label: "Student Id",
	},
	{
		id: "active",
		numeric: false,
		disablePadding: false,
		label: "Active",
	},
	{
		id: "editStudentId",
		numeric: false,
		disablePadding: false,
		label: "",
	},
];

function EnhancedTableHead(props) {
	const {
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort,
	} = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={
							numSelected > 0 && numSelected < rowCount
						}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							"aria-label": "select all desserts",
						}}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? "right" : "left"}
						padding={headCell.disablePadding ? "none" : "normal"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === "desc"
										? "sorted descending"
										: "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

const EnhancedTableToolbar = (props) => {
	const { numSelected, onCreateAdmin } = props;

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) =>
						alpha(
							theme.palette.primary.main,
							theme.palette.action.activatedOpacity
						),
				}),
			}}
		>
			{numSelected > 0 ? (
				<Typography
					sx={{ flex: "1 1 100%" }}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{numSelected} selected
				</Typography>
			) : (
				<Typography
					sx={{ flex: "1 1 100%" }}
					variant="h6"
					id="tableTitle"
					component="div"
				>
					All users
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					sx={{ width: "180px" }}
					onClick={onCreateAdmin}
				>
					Create admin
				</Button>
			)}
		</Toolbar>
	);
};

export default function UsersTab() {
	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState("email");
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [rows, setRows] = useState([]);
	const [modalCreateAdmin, toggleModalCreateAdmin] = useToggle(false);
	const [modalChangeStudentId, toggleModalChangeStudentId] = useToggle(false);
	const [changeStudentIdOfUserId, setChangeStudentIdOfUserId] = useState("");

	const fetchData = async () => {
		const response = await AuthService.getAllUsers();
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
				studentId: user.studentId || "",
				active: user.active ? "Active" : "Disabled",
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

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	return (
		<>
			<Box sx={{ width: "100%", height: "100%" }}>
				<Paper sx={{ width: "100%", mb: 2 }}>
					<EnhancedTableToolbar
						numSelected={selected.length}
						onCreateAdmin={() => toggleModalCreateAdmin(true)}
					/>
					<TableContainer>
						<Table
							sx={{ minWidth: 750 }}
							aria-labelledby="tableTitle"
							size="medium"
						>
							<EnhancedTableHead
								numSelected={selected.length}
								order={order}
								orderBy={orderBy}
								onSelectAllClick={handleSelectAllClick}
								onRequestSort={handleRequestSort}
								rowCount={rows.length}
							/>
							<TableBody>
								{/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
								{rows
									?.slice()
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
												<TableCell
													padding="checkbox"
													sx={{ width: "5%" }}
												>
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
													sx={{ width: "30%" }}
												>
													{row.email}
												</TableCell>
												<TableCell
													align="left"
													sx={{ width: "20%" }}
												>
													{row.name}
												</TableCell>
												<TableCell
													align="left"
													sx={{ width: "10%" }}
												>
													{row.role}
												</TableCell>
												<TableCell
													align="left"
													sx={{ width: "15%" }}
												>
													{row.studentId}
												</TableCell>
												<TableCell
													align="left"
													sx={{ width: "15%" }}
												>
													{row.active}
												</TableCell>
												<TableCell
													align="right"
													sx={{ width: "5%" }}
												>
													{row.studentId && (
														<IconButton
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
													)}
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
		</>
	);
}
