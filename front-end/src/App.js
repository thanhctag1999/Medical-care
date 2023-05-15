import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Provider } from 'react-redux';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import './app.css';
import SocketContext from './contexts/SocketContext';
import { store } from './store/store';
// ----------------------------------------------------------------------

export default function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socketConnection = io.connect(process.env.REACT_APP_URL_IMG);
    setSocket(socketConnection);
  }, []);
  const value = { socket };

  return (
    <Provider store={store}>
      <SocketContext.Provider value={value}>
        <ThemeProvider>
          <ScrollToTop />
          <BaseOptionChartStyle />
          <Router />
        </ThemeProvider>
      </SocketContext.Provider>
    </Provider>
  );
}
