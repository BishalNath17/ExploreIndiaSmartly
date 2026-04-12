import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import routeConfig from './routeConfig';
import ScrollToTop from '../components/ui/ScrollToTop';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#061224]">
    <div className="w-12 h-12 border-4 border-india-orange/30 border-t-india-orange rounded-full animate-spin"></div>
  </div>
);

/**
 * Application router.
 * All routes are rendered inside the shared <Layout />.
 */
const AppRouter = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          {routeConfig.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
