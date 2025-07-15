import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DealList from './pages/DealList';
import DealDetail from './pages/DealDetail';
import Analytics from './pages/Analytics';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/deals" />} />
        <Route path="/deals" element={<DealList />} />
        <Route path="/deals/:id" element={<DealDetail />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
};

export default App;
