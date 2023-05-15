import { Avatar, Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';
import Iconify from '../Iconify';
import StatusDrop from './StatusDrop';
import taskApi from '../../api/taskApi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  height: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

function TaskModal({ open, handleClose, taskSelected, handleUpdateState }) {
  const onUpdateTask = async (status) => {
    const newTask = { ...taskSelected };
    newTask.status = status;
    await taskApi.update(newTask, newTask._id);
    handleUpdateState(newTask);
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <p className="mb-8 text-2xl font-bold text-center">THÔNG TIN CHI TIẾT CÔNG VIỆC</p>
        <div className="flex">
          <div className="w-8/12 pr-2 mr-2">
            <Typography id="modal-modal-title" variant="h6" component="h2" className="text-2xl">
              {taskSelected.topic}
            </Typography>
            <p className="mt-2">Loại công việc: {taskSelected.taskType.name}</p>
            <Button
              variant="outlined"
              className="mt-4"
              to="/dashboard/add-new-user"
              startIcon={<Iconify icon="eva:checkmark-square-2-outline" />}
            >
              Tạo nhiệm vụ
            </Button>
            <Typography id="modal-modal-description" sx={{ mt: 2 }} component={'div'}>
              <p className="font-semibold">Nội dung</p>
              <p>{taskSelected.content}</p>
              <p className="mt-8 font-semibold">Ghi chú</p>
              <p>{taskSelected.note}</p>
            </Typography>
          </div>
          <div className="w-4/12 p-4 ml-2 rounded-xl shadow-2xl bg-white">
            <div className="flex items-center justify-between mb-6">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Chi Tiết
              </Typography>
              <StatusDrop status={taskSelected.status} onUpdateTaskStatus={onUpdateTask} />
            </div>

            <div className="flex items-center">
              <p className="w-1/2 text-sm font-bold text-gray-500">Người thực hiện: </p>
              <div className="flex items-center">
                <Avatar
                  alt={taskSelected.user.fullName}
                  src={taskSelected.user.avatar ? process.env.REACT_APP_URL_IMG + taskSelected.user.avatar : ''}
                />
                <span className="inline-block ml-2">{taskSelected.user.fullName}</span>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <p className="w-1/2 text-sm font-bold text-gray-500">Người giám sát: </p>
              <div className="flex items-center">
                <Avatar
                  alt={taskSelected.supervisor.fullName}
                  src={
                    taskSelected.supervisor.avatar ? process.env.REACT_APP_URL_IMG + taskSelected.supervisor.avatar : ''
                  }
                />
                <span className="inline-block ml-2">{taskSelected.supervisor.fullName}</span>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <p className="w-1/2 text-sm font-bold text-gray-500">Giờ G: </p>
              <span className="inline-block px-2 py-1 ml-2 text-sm bg-gray-200 rounded-lg">{taskSelected.timeG}</span>
            </div>
            <div className="flex items-center mt-3 ">
              <p className="w-1/2 text-sm font-bold text-gray-500">Ngày bắt đầu: </p>
              <span className="inline-block ml-2">{taskSelected.startDate.slice(0, 10)}</span>
            </div>
            <div className="flex items-center mt-3 ">
              <p className="w-1/2 text-sm font-bold text-gray-500">Ngày kết thúc: </p>
              <span className="inline-block ml-2">{taskSelected.endDate.slice(0, 10)}</span>
            </div>
            <div className="flex items-center mt-3 ">
              <p className="w-1/2 text-sm font-bold text-gray-500">Ước tính: </p>
              <span className="inline-block px-2 py-1 ml-2 text-sm bg-gray-200 rounded-lg">
                {Math.floor((Date.parse(taskSelected.endDate) - Date.parse(taskSelected.startDate)) / 86400000) + 1}{' '}
                ngày
              </span>
            </div>
            <p className="mt-4 text-sm font-thin text-gray-500">
              Ngày tạo công việc: {taskSelected.createdAt.slice(0, 10)}
            </p>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default TaskModal;
