import {
  Avatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';

function StatisticalTable({ users, tasks }) {
  const sumTimeG = (userId) => {
    let result = 0;
    const userTasks = tasks.filter((each) => each.user._id === userId);
    userTasks.forEach((each) => {
      result += each.timeG;
    });
    return result;
  };
  const countTasks = (userId) => (tasks ? tasks.filter((each) => each.user._id === userId).length : 0);
  const countPendingTasks = (userId) =>
    tasks ? tasks.filter((each) => each.user._id === userId && each.status === 'Đang chờ thực hiện').length : 0;
  const countInProgressTasks = (userId) =>
    tasks ? tasks.filter((each) => each.user._id === userId && each.status === 'Đang thực hiện').length : 0;
  const countCompletedTasks = (userId) =>
    tasks ? tasks.filter((each) => each.user._id === userId && each.status === 'Hoàn thành').length : 0;

  return (
    <div className="mt-10">
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Người dùng</TableCell>
              <TableCell align="left">Số công việc đang làm</TableCell>
              <TableCell align="left">Số công việc chưa làm </TableCell>
              <TableCell align="left">Số công việc đã hoàn thành</TableCell>
              <TableCell align="left">Tổng số công việc</TableCell>
              <TableCell align="left">Tổng giờ G</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="left" component="th" scope="row" padding="none" className="pl-4">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar alt={row.fullName} src={row.avatar ? process.env.REACT_APP_URL_IMG + row.avatar : ''} />
                    <Typography variant="subtitle2" noWrap>
                      {row.fullName}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">{countInProgressTasks(row._id)}</TableCell>
                <TableCell align="center">{countPendingTasks(row._id)}</TableCell>
                <TableCell align="center">{countCompletedTasks(row._id)}</TableCell>
                <TableCell align="center">{countTasks(row._id)}</TableCell>
                <TableCell align="center">{sumTimeG(row._id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default StatisticalTable;
