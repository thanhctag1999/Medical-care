// material
import {
  Avatar,
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { getLateDays } from '../utils/dateLate';
import subtaskApi from '../api/subtaskApi';
// mock
import taskApi from '../api/taskApi';
import taskTypeApi from '../api/taskTypeApi';
import userApi from '../api/userApi';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import StatisticalTable from '../components/StatisticalTable';
import TaskModal from '../components/task/TaskModal';
import TaskListToolbar from '../sections/@dashboard/task/TaskListToolbar';
import { UserListHead } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'stt', label: 'Số thứ tự', alignRight: true },
  { id: 'taskType', label: 'Loại Công Việc', alignRight: false },
  { id: 'topic', label: 'Chủ đề', alignRight: false },
  { id: 'user', label: 'Người Thực Hiện', alignRight: false },
  { id: 'timeG', label: 'Giờ G', alignRight: false },
  { id: 'endDate', label: 'Ngày Kết Thúc', alignRight: false },
  { id: 'status', label: 'Trạng Thái', alignRight: false },
  { id: 'late', label: 'Trễ hạn', alignRight: false },
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

function applySortFilter(array, comparator, query, taskTypeId, status, user, startDate, endDate) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  array = stabilizedThis.map((el) => el[0]);

  if (taskTypeId) {
    array = filter(array, (_user) => _user.taskType._id === taskTypeId);
  }

  if (query) {
    array = filter(array, (_user) => _user.topic.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  if (status) {
    array = filter(array, (_user) => _user.status === status);
  }
  if (user) {
    array = filter(array, (_user) => _user.user._id === user);
  }

  try {
    if (startDate) {
      const year = startDate.toISOString().slice(0, 4);
      const month = startDate.toISOString().slice(5, 7);
      const day = startDate.toISOString().slice(8, 10);
      const data = filter(
        array,
        (_user) =>
          _user.startDate.slice(0, 4) === year &&
          _user.startDate.slice(5, 7) === month &&
          _user.startDate.slice(8, 10) >= day
      );
      array = data && data.length >= 0 ? data : array;
    }
    if (endDate) {
      const year = endDate.toISOString().slice(0, 4);
      const month = endDate.toISOString().slice(5, 7);
      const day = endDate.toISOString().slice(8, 10);
      const data = filter(
        array,
        (_user) =>
          _user.endDate.slice(0, 4) === year && _user.endDate.slice(5, 7) === month && _user.endDate.slice(8, 10) <= day
      );
      array = data && data.length >= 0 ? data : array;
    }
  } catch (eror) {
    // Do nothing
  }

  return array;
}

export default function StatisticalTask() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterTask, setFilterTask] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tasks, setTask] = useState([]);
  const [isOpenModal, setOpenModal] = useState(false);
  const [taskSelected, setTaskSelected] = useState();
  const [taskTypes, setTaskTypes] = useState([]);
  const [userList, setUserList] = useState([]);
  const [filterByTaskType, setFilterByTaskType] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('');
  const [filterByUser, setFilterByUser] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [isGenerateData, setIsGenerateData] = useState(false);

  const hideCheckbox = true;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await taskApi.getAll();
      setTask(response);
      const responseTaskTypes = await taskTypeApi.getTaskTypes();
      setTaskTypes(responseTaskTypes);
      const responseUser = await userApi.getAll();
      setUserList(responseUser);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [filterByTaskType, filterByStatus, filterTask, filterByUser]);

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

  const filteredTasks = applySortFilter(
    tasks,
    getComparator(order, orderBy),
    filterTask,
    filterByTaskType,
    filterByStatus,
    filterByUser,
    startDate,
    endDate
  );

  const isUserNotFound = filteredTasks.length === 0;

  const handleClickTaskModal = () => {
    if (isOpenModal) {
      setTaskSelected();
    }
    setOpenModal(!isOpenModal);
  };

  const handleUpdateState = (task) => {
    const idxTask = tasks.findIndex((each) => each._id === task._id);
    const newTasks = [...tasks];
    newTasks[idxTask] = task;
    setTask(newTasks);
  };

  const convertJsonToSheet = (index, task, subtask, worker, startDate, endDate, status, progress, timeG) => {
    const currentDate = new Date();
    const late =
      currentDate > new Date(endDate) && status !== 'Hoàn thành' && status !== 'Hủy bỏ'
        ? `đã trễ ${getLateDays(endDate)} ngày`
        : '';
    return {
      STT: index,
      'Công việc': task,
      'Nhiệm vụ': subtask,
      'Người thực hiện': worker,
      'Thời gian bắt đầu': startDate,
      'Thời gian kết thúc': endDate,
      'Trạng Thái': status,
      'Tỷ lệ % hoàn thành': progress,
      'Ghi Chú': late,
      'Giờ G': timeG,
    };
  };

  const sumTimeG = (total) => ({
    STT: '',
    'Công việc': '',
    'Nhiệm vụ': '',
    'Người thực hiện': '',
    'Thời gian bắt đầu': '',
    'Thời gian kết thúc': '',
    'Trạng Thái': '',
    'Tỷ lệ % hoàn thành': '',
    'Ghi Chú': '',
    'Giờ G': `TỔNG: ${total}`,
  });

  const formatDate = (date) => date.slice(0, 10);

  const generateData = async () => {
    const data = [];
    let count = 1;
    let timeG = 0;
    try {
      for (let idx = 0; idx < filteredTasks.length; idx += 1) {
        const task = filteredTasks[idx];
        // eslint-disable-next-line no-await-in-loop
        const subtasks = await subtaskApi.getSubtasks(task._id);
        if (subtasks && subtasks.length > 0) {
          // eslint-disable-next-line no-loop-func
          subtasks.forEach((each, index) => {
            if (index === 0) {
              // add task
              data.push(
                convertJsonToSheet(
                  count,
                  task.topic,
                  task.topic,
                  task.user.fullName,
                  formatDate(task.startDate),
                  formatDate(task.endDate),
                  task.status,
                  task.progress,
                  task.timeG
                )
              );
              timeG += task.timeG;

              // add subtask
              data.push(
                convertJsonToSheet(
                  '',
                  '',
                  each.topic,
                  each.user.fullName,
                  formatDate(each.startDate),
                  formatDate(each.endDate),
                  each.status,
                  each.progress,
                  each.timeG
                )
              );
              timeG += each.timeG;
              count += 1;
            } else {
              data.push(
                convertJsonToSheet(
                  '',
                  '',
                  each.topic,
                  each.user.fullName,
                  formatDate(each.startDate),
                  formatDate(each.endDate),
                  each.status,
                  each.progress,
                  each.timeG
                )
              );
              timeG += each.timeG;
            }
          });
        } else {
          data.push(
            convertJsonToSheet(
              count,
              task.topic,
              task.topic,
              task.user.fullName,
              formatDate(task.startDate),
              formatDate(task.endDate),
              task.status,
              task.progress,
              task.timeG
            )
          );
          count += 1;
          timeG += task.timeG;
        }
      }
      data.push(sumTimeG(timeG));
    } catch (err) {
      console.log(err);
    }
    return data;
  };

  const onDownload = async () => {
    setIsGenerateData(true);
    const worksheet = XLSX.utils.json_to_sheet(await generateData());
    // Set cell width when export data
    worksheet['!cols'] = [
      { wch: 5 }, // STT
      { wch: 40 }, // task,
      { wch: 40 }, // subtask,
      { wch: 15 }, // worker,
      { wch: 16 }, // startDate,
      { wch: 16 }, // endDate,
      { wch: 17 }, // status,
      { wch: 17 }, // progress,
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Thống kê công việc');
    XLSX.writeFile(workbook, 'Thống Kê Báo Cáo.xlsx');
    setIsGenerateData(false);
  };

  const lateTask = (endDate, status) => {
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const monthOfTask = endDate.slice(5, 7);
    const dayOfTask = endDate.slice(8, 10);
    const late = day - parseInt(dayOfTask, 10);
    const comming = parseInt(dayOfTask, 10) - day;
    if (parseInt(monthOfTask, 10) === month || parseInt(monthOfTask, 10) < month) {
      if ((parseInt(dayOfTask, 10) - day < 1 && status === 'Đang chờ thực hiện') || status === 'Đang thực hiện') {
        return <p className="text-red-600">Trễ hạn {late} ngày</p>;
      }
      if (
        (parseInt(dayOfTask, 10) - day >= 1 && parseInt(dayOfTask, 10) - day <= 3 && status === 'Đang chờ thực hiện') ||
        status === 'Đang thực hiện'
      ) {
        return <p className="text-orange-600">Còn {comming} ngày nữa đến hạn</p>;
      }
      return null;
    }
    return null;
  };

  return (
    <Page title="Thống kê công việc">
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
            Thống kê công việc
          </Typography>
        </Stack>
        <Card>
          <TaskListToolbar filterName={filterTask} onFilterName={handleFilterByName} />
          <div className="flex justify-between px-3">
            <div className="w-1/6">
              <FormControl className="w-full">
                <InputLabel>Loại Công Việc</InputLabel>
                <Select
                  label="Loại Công Việc"
                  value={filterByTaskType}
                  onChange={(e) => setFilterByTaskType(e.target.value)}
                >
                  <MenuItem value="">Chọn loại công việc</MenuItem>
                  {taskTypes.map((each) => (
                    <MenuItem key={each._id} value={each._id}>
                      {each.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="w-1/6 ml-4">
              <FormControl className="w-full">
                <InputLabel>Trạng Thái</InputLabel>
                <Select label="Trạng Thái" value={filterByStatus} onChange={(e) => setFilterByStatus(e.target.value)}>
                  <MenuItem value="">Chọn Trạng Thái</MenuItem>
                  <MenuItem value="Đang chờ thực hiện">Đang chờ thực hiện</MenuItem>
                  <MenuItem value="Đang thực hiện">Đang thực hiện</MenuItem>
                  <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                  <MenuItem value="Hủy bỏ">Hủy bỏ</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="w-1/6 ml-4">
              <FormControl className="w-full">
                <InputLabel>Người thực hiện</InputLabel>
                <Select
                  className="flex justify-end w-full px-3"
                  label="Người thực hiện"
                  value={filterByUser}
                  onChange={(e) => setFilterByUser(e.target.value)}
                >
                  <MenuItem value="">Chọn người thực hiện</MenuItem>
                  {userList.map((each) => (
                    <MenuItem className="h-14" key={each._id} value={each._id}>
                      <div className="flex items-center">
                        <Avatar
                          alt={each.fullName}
                          src={each.avatar ? process.env.REACT_APP_URL_IMG + each.avatar : ''}
                        />
                        <span className="ml-2">{each.fullName}</span>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="w-1/6 ml-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Ngày bắt đầu"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div className="w-1/6 ml-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Ngày kết thúc"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
          </div>

          {filteredTasks.length > 0 && (
            <div className="flex justify-end mt-4">
              <Button
                variant="contained"
                onClick={onDownload}
                className="w-[200px] h-[40px] mr-3"
                disabled={isGenerateData}
              >
                {!isGenerateData && <i className="mr-2 fa-solid fa-download" />}
                {isGenerateData ? <i className="fa-solid fa-spinner animate-spin" /> : 'Xuất file excel'}
              </Button>
            </div>
          )}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table className="mt-4">
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tasks.length}
                  onRequestSort={handleRequestSort}
                  hideCheckbox={hideCheckbox}
                />
                <TableBody>
                  {filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
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
                      <TableCell align="left">{row.timeG}</TableCell>
                      <TableCell align="left">{row.endDate.slice(0, 10)}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>

                      <TableCell align="center">{lateTask(row.endDate, row.status)}</TableCell>
                      <TableCell align="right">
                        <Link className="text-black" to={`/dashboard/task-info/${row._id}`}>
                          <i className="fa-solid fa-circle-info" />
                        </Link>
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
            count={filteredTasks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <StatisticalTable users={userList} tasks={filteredTasks} />
        </Card>
      </Container>
    </Page>
  );
}
