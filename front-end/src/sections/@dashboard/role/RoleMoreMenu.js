import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
// component
import Iconify from '../../../components/Iconify';
import roleApi from '../../../api/roleApi';
import { checkPermissionCreateAndDelete, checkPermissionEdit } from '../../../utils/checkAccess';

// ----------------------------------------------------------------------

export default function RoleMoreMenu({ id, handleDeleteRole }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const onDeleteUser = async () => {
    await roleApi.delete(id);
    handleDeleteRole(id);
  };
  const currentUser = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      {checkPermissionEdit() && (
        <IconButton ref={ref} onClick={() => setIsOpen(true)}>
          <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
        </IconButton>
      )}

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {currentUser._id !== id && checkPermissionCreateAndDelete() && (
          <MenuItem sx={{ color: 'text.secondary' }} onClick={onDeleteUser}>
            <ListItemIcon>
              <Iconify icon="eva:trash-2-outline" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Xóa" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
        <MenuItem component={RouterLink} to={`/dashboard/edit-role/${id}`} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Chỉnh sửa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}

RoleMoreMenu.propTypes = {
  id: PropTypes.string,
  handleDeleteRole: PropTypes.func,
};
