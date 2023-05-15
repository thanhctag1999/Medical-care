import React from 'react';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Link as RouterLink } from 'react-router-dom';

function taskTable({ tasks }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Loại công việc</TableCell>
            <TableCell align="left">Người giám sát</TableCell>
            <TableCell align="left">Chủ để</TableCell>
            <TableCell align="left">Nội dung</TableCell>
            <TableCell align="left">Ghi chú</TableCell>
            <TableCell align="left">Trạng thái</TableCell>
            <TableCell align="left">Ngày kết thúc</TableCell>
            <TableCell align="left" />
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((row) => (
            <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="left">{row.taskType.name}</TableCell>
              <TableCell align="left" className="flex items-center">
                <Avatar
                  component={'span'}
                  alt={row.supervisor.fullName}
                  src={row.supervisor.avatar ? process.env.REACT_APP_URL_IMG + row.supervisor.avatar : ''}
                />
                <span className="inline-block ml-2">{row.supervisor.fullName}</span>
              </TableCell>
              <TableCell align="left" className="truncate max-w-[140px]">
                {row.topic}
              </TableCell>
              <TableCell align="left" className="truncate max-w-[100px]">
                {row.content}
              </TableCell>
              <TableCell align="left" className="truncate max-w-[100px]">
                {row.note}
              </TableCell>
              <TableCell align="left">{row.status}</TableCell>
              <TableCell align="left">{row.endDate.slice(0, 10)}</TableCell>
              <TableCell component={RouterLink} to={`/dashboard/task-info/${row._id}`} align="left">
                <i className="text-xl cursor-pointer fa-solid fa-circle-info" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default taskTable;
