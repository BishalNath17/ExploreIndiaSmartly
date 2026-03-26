import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import routeConfig from './routeConfig';

/**
 * Application router.
 * All routes are rendered inside the shared <Layout />.
 */
const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        {routeConfig.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
