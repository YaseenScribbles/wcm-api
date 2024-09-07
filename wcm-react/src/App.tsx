import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "boxicons";
import { NotificationContextProvider } from "./contexts/NotificationContext";
import UserContextProvider from "./contexts/UserContext";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "box-icon": any;
        }
    }
}

function App() {
    return (
        <>
            <UserContextProvider>
                <NotificationContextProvider>
                    <RouterProvider router={router} />
                </NotificationContextProvider>
            </UserContextProvider>
        </>
    );
}

export default App;
