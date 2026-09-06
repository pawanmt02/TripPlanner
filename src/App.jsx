import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Explore = lazy(() => import('./pages/Explore'));
const Planner = lazy(() => import('./pages/Planner'));
const Auth = lazy(() => import('./pages/Auth'));

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Suspense>
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
