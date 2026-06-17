import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './screens/Auth/ProtectedRoute';
import Login from './screens/Auth/Login';
import SignUp from './screens/Auth/SignUp';
import Dashboard from './screens/Dashboard/Dashboard';
import RecipeSearch from './screens/RecipeSearch/RecipeSearch';
import RecipeDetail from './screens/RecipeDetail/RecipeDetail';
import MealPlanner from './screens/MealPlanner/MealPlanner';
import GroceryList from './screens/GroceryList/GroceryList';
import Collections from './screens/Collections/Collections';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/search" element={<RecipeSearch />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/recipe/external/:id" element={<RecipeDetail />} />
          <Route path="/planner" element={<ProtectedRoute><MealPlanner /></ProtectedRoute>} />
          <Route path="/grocery" element={<ProtectedRoute><GroceryList /></ProtectedRoute>} />
          <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
          <Route path="/dishquest" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
