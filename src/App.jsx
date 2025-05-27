import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Upload from './pages/Upload';
import Documents from './pages/Documents';
import DocumentViewer from './pages/DocumentViewer';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/register" />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />

      <ErrorBoundary>
        <Routes>
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/upload"
            element={
              isAuthenticated ? <Upload /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/documents"
            element={<PrivateRoute><Documents /></PrivateRoute>}
          />
          <Route
            path="/documents/:id"
            element={<PrivateRoute><DocumentViewer /></PrivateRoute>}
          />
          <Route path="*" element={<Navigate to="/documents" />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
