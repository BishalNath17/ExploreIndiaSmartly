/**
 * Central route configuration.
 * Each entry maps a path to a lazy-loadable page component.
 * Dynamic segments use :param syntax.
 *
 * The wildcard '*' route catches all unknown paths → 404.
 */
import HomePage from '../pages/HomePage';
import AllStatesPage from '../pages/AllStatesPage';
import StateDetailsPage from '../pages/StateDetailsPage';
import DestinationDetailsPage from '../pages/DestinationDetailsPage';
import BudgetPlannerPage from '../pages/BudgetPlannerPage';
import TravelPlannerPage from '../pages/TravelPlannerPage';
import SafetyTipsPage from '../pages/SafetyTipsPage';
import HiddenGemsPage from '../pages/HiddenGemsPage';
import NotFoundPage from '../pages/NotFoundPage';

const routeConfig = [
  { path: '/', element: <HomePage /> },
  { path: '/states', element: <AllStatesPage /> },
  { path: '/state/:stateSlug', element: <StateDetailsPage /> },
  { path: '/destination/:destSlug', element: <DestinationDetailsPage /> },
  { path: '/budget-planner', element: <BudgetPlannerPage /> },
  { path: '/travel-planner', element: <TravelPlannerPage /> },
  { path: '/safety-tips', element: <SafetyTipsPage /> },
  { path: '/hidden-gems', element: <HiddenGemsPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export default routeConfig;
