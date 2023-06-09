import { useEffect, useState, forwardRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// material
import { styled } from '@mui/material/styles';
import { Slide, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { fetchUserById } from '../../store/slices/userSlice';
import { closeNotification } from '../../store/slices/NotificationSlice';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------
const currentUser = JSON.parse(localStorage.getItem('user'));
const Alert = forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem('token');
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { isOpen, message } = useSelector((state) => state.notification) || {};

  if (!token) {
    window.location.href = '/login';
  }

  useEffect(() => {
    if (currentUser && !user) {
      dispatch(fetchUserById(currentUser._id));
    }
  }, [dispatch, user]);

  const handleCloseNotification = () => {
    dispatch(closeNotification());
  };
  return (
    <RootStyle>
      <Snackbar
        className="mt-10 cursor-pointer"
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isOpen}
        onClick={handleCloseNotification}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      {token ? (
        <>
          <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
          <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
          <MainStyle>
            <Outlet />
          </MainStyle>
        </>
      ) : (
        <div className="flex items-center justify-center min-w-full min-h-screen">
          <p>Loading...</p>
        </div>
      )}
    </RootStyle>
  );
}
