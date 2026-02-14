import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "boxicons/css/boxicons.min.css";
import { NotificationContextProvider } from "./contexts/NotificationContext";
import UserContextProvider from "./contexts/UserContext";
import { Provider } from "react-redux";
import { store } from "./Redux Store/Store";

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
            <Provider store={store}>
                <UserContextProvider>
                    <NotificationContextProvider>
                        <RouterProvider router={router} />
                    </NotificationContextProvider>
                </UserContextProvider>
            </Provider>
        </>
    );
}

export default App;
