import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Avatar,
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
// components
import Iconify from '../components/Iconify';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead } from '../sections/@dashboard/user';
// mock
import taskApi from '../api/taskApi';
import TaskListToolbar from '../sections/@dashboard/task/TaskListToolbar';
import TaskMoreMenu from '../sections/@dashboard/task/TaskMoreMenu';
import TaskModal from '../components/task/TaskModal';
import { checkPermissionCreateAndDelete } from '../utils/checkAccess';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'stt', label: 'Số thứ tự', alignRight: true },
  { id: 'taskType', label: 'Loại Công Việc', alignRight: false },
  { id: 'topic', label: 'Chủ đề', alignRight: false },
  { id: 'user', label: 'Người Thực Hiện', alignRight: false },
  { id: 'supervisor', label: 'Người Giám Sát', alignRight: false },
  { id: 'timeG', label: 'Giờ G', alignRight: false },
  { id: 'link', label: 'Link hoạt động', alignRight: false },
  { id: 'status', label: 'Trạng Thái', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (orderBy === 'taskType') {
    if (b[orderBy].name < a[orderBy].name) {
      return -1;
    }
    if (b[orderBy].name > a[orderBy].name) {
      return 1;
    }
  }

  if (orderBy === 'user' || orderBy === 'supervisor') {
    if (b[orderBy].fullName < a[orderBy].fullName) {
      return -1;
    }
    if (b[orderBy].fullName > a[orderBy].fullName) {
      return 1;
    }
  }

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.topic.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Task() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterTask, setFilterTask] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tasks, setTask] = useState([]);
  const [isOpenModal, setOpenModal] = useState(false);
  const [taskSelected, setTaskSelected] = useState();

  const hideCheckbox = true;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await taskApi.getAll();
      setTask(response);
    };

    fetchUsers();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterTask(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tasks.length) : 0;

  const filteredUsers = applySortFilter(tasks, getComparator(order, orderBy), filterTask);

  const isUserNotFound = filteredUsers.length === 0;

  const handleDeleteTask = (id) => {
    const newUser = tasks.filter((each) => each._id !== id);
    setTask(newUser);
  };

  const handleClickTaskModal = () => {
    if (isOpenModal) {
      setTaskSelected();
    }
    setOpenModal(!isOpenModal);
  };

  const handleOpenTaskModal = (id) => {
    const task = tasks.find((each) => each._id === id);
    setTaskSelected(task);
    handleClickTaskModal();
  };

  const handleUpdateState = (task) => {
    const idxTask = tasks.findIndex((each) => each._id === task._id);
    const newTasks = [...tasks];
    newTasks[idxTask] = task;
    setTask(newTasks);
  };
  return (
    <Page title="Quản lý công việc">
      {taskSelected && (
        <TaskModal
          taskSelected={taskSelected}
          open={isOpenModal}
          handleClose={handleClickTaskModal}
          handleUpdateState={handleUpdateState}
        />
      )}

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Quản lý công việc
          </Typography>
          {checkPermissionCreateAndDelete() && (
            <Button
              variant="contained"
              component={RouterLink}
              to="/dashboard/add-new-task"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Thêm công việc
            </Button>
          )}
        </Stack>

        <Card>
          <TaskListToolbar filterName={filterTask} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tasks.length}
                  onRequestSort={handleRequestSort}
                  hideCheckbox={hideCheckbox}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow hover key={row._id} tabIndex={-1}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="left">{row.taskType.name}</TableCell>
                      <Tooltip title={row.topic}>
                        <TableCell align="left truncate max-w-[100px]">{row.topic}</TableCell>
                      </Tooltip>
                      <TableCell align="left">
                        <div className="flex items-center">
                          <Avatar
                            alt={row.user.fullName}
                            src={row.user.avatar ? process.env.REACT_APP_URL_IMG + row.user.avatar : ''}
                          />
                          <span className="inline-block ml-2">{row.user.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className="flex items-center">
                          <Avatar
                            alt={row.supervisor.fullName}
                            src={row.supervisor.avatar ? process.env.REACT_APP_URL_IMG + row.supervisor.avatar : ''}
                          />
                          <span className="inline-block ml-2">{row.supervisor.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell align="left">{row.timeG}</TableCell>
                      <Tooltip title={row.link}>
                        <TableCell align="left">
                          {row.link && (
                            <a
                              href={/^http/.test(row.link) ? row.link : `https://${row.link}`}
                              rel="noreferrer"
                              target="_blank"
                              className="truncate max-w-[150px] inline-block"
                            >
                              {row.link}
                            </a>
                          )}
                        </TableCell>
                      </Tooltip>

                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="right">
                        <TaskMoreMenu
                          id={row._id}
                          handleDeleteTask={handleDeleteTask}
                          handleOpenTaskModal={handleOpenTaskModal}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterTask} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tasks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
