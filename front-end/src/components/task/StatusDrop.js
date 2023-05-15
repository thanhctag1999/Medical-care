import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { checkPermissionCreateAndDelete } from '../../utils/checkAccess';

export default function StatusDrop({ status, onUpdateTaskStatus, task }) {
  const [anchorEl, setAnchorEl] = useState();
  const [statusSelected, setStatusSelected] = useState(status);
  const open = Boolean(anchorEl);
  const { user } = useSelector((state) => state.user);
  const handleClick = (event) => {
    if (task.user._id === user._id || checkPermissionCreateAndDelete()) setAnchorEl(event.currentTarget);
  };

  const handleClose = (taskStatus) => {
    if (typeof taskStatus === 'string') {
      onUpdateTaskStatus(taskStatus);
      setStatusSelected(taskStatus);
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(e) => handleClick(e)}
        className="text-[#333] px-4 bg-gray-200"
      >
        {statusSelected}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleClose('Đang chờ thực hiện')}>Đang chờ thực hiện</MenuItem>
        <MenuItem onClick={() => handleClose('Đang thực hiện')}>Đang thực hiện</MenuItem>
        <MenuItem onClick={() => handleClose('Hoàn thành')}>Hoàn thành</MenuItem>
        <MenuItem onClick={() => handleClose('Hủy bỏ')}>Hủy bỏ</MenuItem>
      </Menu>
    </div>
  );
}
