import { ThemeProvider } from "@/components/theme-provider";
import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Routes from "@/Routes";

const router = createBrowserRouter(createRoutesFromElements([Routes]));

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
