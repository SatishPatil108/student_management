import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';

const App = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
            {/* Global Toast notifications */}
            <ToastContainer position='top-center' autoClose={3000} />
        </BrowserRouter>
    )
}

export default App