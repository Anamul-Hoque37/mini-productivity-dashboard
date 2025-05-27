import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import Greeting from './Components/Greeting.jsx';
import TaskManagement from './Components/TaskManagement.jsx';
import ProtectedRoute from './Authentication/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <Greeting></Greeting>,
      },
      {
        path: "/tasks",
        element: <ProtectedRoute><TaskManagement></TaskManagement></ProtectedRoute>,
      },
    ],
  },
]);

const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
