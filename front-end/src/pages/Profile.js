import { Box, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyIcon from '@mui/icons-material/Key';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useState } from 'react';
import Page from '../components/Page';
import ChangePassword from '../sections/@dashboard/profile/ChangePassword';
import ProfileForm from '../sections/@dashboard/profile/ProfileForm';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function Profile(props) {
  const { user } = useSelector((state) => state.user);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Page title="Thông tin cá nhân">
      <Typography className="ml-6" variant="h4" gutterBottom>
        Thông tin cá nhân
      </Typography>
      <Container>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab icon={<AccountBoxIcon />} iconPosition="start" label="Thông tin" {...a11yProps(0)} />
              <Tab icon={<ReceiptIcon />} iconPosition="start" label="Thanh toán" {...a11yProps(2)} />
              <Tab icon={<KeyIcon />} iconPosition="start" label="Đổi mật khẩu" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {user ? <ProfileForm user={user} /> : <p>Loading...</p>}
          </TabPanel>
          <TabPanel value={value} index={1}>
            UpComing
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ChangePassword />
          </TabPanel>
        </Box>
      </Container>
    </Page>
  );
}

export default Profile;
