import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ToastContainer from './components/ToastContainer';

export default function App() {
  return (
    <BrowserRouter>
      <OrderProvider>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dang-ky" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </OrderProvider>
    </BrowserRouter>
  );
}
