/**
 * Central route configuration.
 * Each entry maps a path to a lazy-loadable page component.
 * Dynamic segments use :param syntax.
 *
 * The wildcard '*' route catches all unknown paths → 404.
 */
import { lazy } from 'react';

const HomePage = lazy(() => import('../pages/HomePage'));
const AllStatesPage = lazy(() => import('../pages/AllStatesPage'));
const StateDetailsPage = lazy(() => import('../pages/StateDetailsPage'));
const DestinationDetailsPage = lazy(() => import('../pages/DestinationDetailsPage'));
const BudgetPlannerPage = lazy(() => import('../pages/BudgetPlannerPage'));
const TravelPlannerPage = lazy(() => import('../pages/TravelPlannerPage'));
const SafetyTipsPage = lazy(() => import('../pages/SafetyTipsPage'));
const HiddenGemsPage = lazy(() => import('../pages/HiddenGemsPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const BlogPostPage = lazy(() => import('../pages/BlogPostPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

const routeConfig = [
  { path: '/', element: <HomePage /> },
  { path: '/states', element: <AllStatesPage /> },
  { path: '/state/:stateSlug', element: <StateDetailsPage /> },
  { path: '/destination/:destSlug', element: <DestinationDetailsPage /> },
  { path: '/budget-planner', element: <BudgetPlannerPage /> },
  { path: '/travel-planner', element: <TravelPlannerPage /> },
  { path: '/safety-tips', element: <SafetyTipsPage /> },
  { path: '/hidden-gems', element: <HiddenGemsPage /> },
  { path: '/blog', element: <BlogPage /> },
  { path: '/blog/:slug', element: <BlogPostPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/admin', element: <AdminLogin /> },
  { path: '/admin/dashboard', element: <AdminDashboard /> },
  { path: '*', element: <NotFoundPage /> },
];

export default routeConfig;
