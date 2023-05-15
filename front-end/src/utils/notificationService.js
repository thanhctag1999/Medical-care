import { closeNotification, openNotification } from '../store/slices/NotificationSlice';
import { store } from '../store/store';

export const onOpenNotification = (message) => {
  store.dispatch(openNotification(message));
  setTimeout(() => {
    store.dispatch(closeNotification(message));
  }, 5000);
};
