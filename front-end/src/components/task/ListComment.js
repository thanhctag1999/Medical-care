import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function ListComment({ comments, onDeleteComment }) {
  const handleDelete = (id) => {
    onDeleteComment(id);
  };
  const currentUser = JSON.parse(localStorage.getItem('user'));

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {comments &&
        comments.map((each) => (
          <div key={each._id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt="Remy Sharp"
                  src={each.user.avatar ? process.env.REACT_APP_URL_IMG + each.user.avatar : ''}
                />
              </ListItemAvatar>
              <div className="w-full">
                <div className="flex items-center justify-between w-full">
                  <p className="font-bold">
                    {each.user.fullName}{' '}
                    <span className="ml-2 text-sm font-thin text-gray-600">{dayjs(each.createdAt).fromNow()}</span>
                  </p>
                  {currentUser._id === each.user._id && (
                    <i
                      onClick={() => handleDelete(each._id)}
                      className="duration-300 cursor-pointer fa-regular fa-trash-can hover:text-red-600"
                    />
                  )}
                </div>
                <p className="font-thin text-[#333]">{each.content}</p>
              </div>
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))}
    </List>
  );
}
