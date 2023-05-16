// @mui
import { Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

// components
import Page from '../components/Page';
import Carousel from '../sections/@dashboard/app/Carousel';
import userApi from '../api/userApi';

export default function DashboardApp() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userApi.getAll();
      setUsers(response);
    };

    fetchUsers();
  }, []);
  return (
    <Page title="Dashboard">
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bác sĩ tư vấn
        </Typography>
        <Carousel items={users} />
      </Container>
    </Page>
  );
}
