import { Avatar, Button, CardActions, CardContent, Container, Rating, Typography } from '@mui/material';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { styled } from '@mui/material/styles';
import Age from './Age';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  margin: 'auto',
  marginTop: 30,
  marginBottom: 30,
  height: '420px',
  display: 'flex',
  justifyContent: 'space-between',
  boxShadow: theme.customShadows.z24,
  padding: theme.spacing(12, 0),
  borderRadius: theme.spacing(2),
}));
function Carousel(props) {
  const { items } = props;

  return (
    <Container className="doctors-container" maxWidth="lg">
      {items.map((item) => (
        // eslint-disable-next-line react/jsx-key
        <ContentStyle className="doctors cursor-pointer bg-gradient-to-r from-green-300 to-sky-300" key={item._id}>
          <Avatar
            className="ml-6"
            sx={{ width: 200, height: 200 }}
            src={process.env.REACT_APP_URL_IMG + item.avatar}
            alt=""
          />
          <CardContent className="w-3/4">
            <Typography className="flex" gutterBottom variant="h5" component="div">
              {item.degree} {item.fullName}
              <Age birthday={item.birthday} />
            </Typography>
            <Typography className="flex items-center" gutterBottom variant="h6" component="div">
              {item.specialist ? `Chuyên khoa ${item.specialist}` : ''}
              {item.rating > 0 ? <Rating className="ml-4" name="simple-controlled" readOnly value={item.rating} /> : ''}
            </Typography>
            <Typography className="flex" variant="p" color="text.secondary">
              <p className="mr-2 mb-2">1242 lượt khám</p> <VaccinesIcon />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description ? item.description : ''}
            </Typography>
            <CardActions className="mt-4">
              <Button size="medium" variant="contained">
                Xem chi tiết
              </Button>
              <Button size="medium" variant="contained">
                Đặt lịch hẹn
              </Button>
            </CardActions>
          </CardContent>
        </ContentStyle>
      ))}
    </Container>
  );
}

export default Carousel;
