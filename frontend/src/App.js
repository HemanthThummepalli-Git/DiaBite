import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signin from "./components/Signin";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";
// import Dashboard from "./components/Dashboard";
import Signup01 from "./components/signup11/Signup01";
import Signup02 from "./components/signup11/Signup02";
import Signup03 from "./components/signup11/Signup03";
import CGMForm from "./components/cgm/CGMForm";
//import VoiceMealLogger from "./components/VoiceMealLogger";
import FoodTracking from "./components/FoodTracking";
import OverallDashboard from "./components/OverallDashboard";
import AiRecommendations from "./components/AiRecommendations";
import Showcase from "./components/Showcase";


function App() {
  
  let router = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path:"/",
          element:<Home />
        },
        {
          path: "/signin",
          element: <Signin />,
        },
        {
          path: "/dashboard",
          element: <OverallDashboard/>,
        },{
          path:"sugar-tracker",
          element:<CGMForm/>
        },{
          path:"food-logging",
          element:<FoodTracking/>
        },
        {
          path: "ai-recommendations",
          element: <AiRecommendations/>
        },
        {
          path: "/signup1",
          element: <Signup01 />,
        },
        {
          path: "/signup2",
          element: <Signup02 />,
        },
        {
          path: "/signup3",
          element: <Signup03 />,
        },
        {
          path: "/showcase",
          element: <Showcase />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
