import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
// import { API_URL } from "../assets/common";
// import axios from "axios";

type PrivateRouteProps = {
    element: ReactNode;
    menu: string;
};

// type Menu = {
//     id: number;
//     name: string;
// };

// A function that takes a role and returns a component
const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, menu }) => {
    const { menus } = useUserContext();
    // const [loading, setLoading] = useState(true);
    // const [navbarHeight, setNavbarHeight] = useState(58);

    // const fetchMenus = async () => {
    //     try {
    //         const { data } = await axios.get(`${API_URL}menus/${user!.id}`);
    //         const menus = data.user_menus.map((menu: Menu) =>
    //             menu.name.toUpperCase()
    //         );
    //         setMenus(menus);
    //     } catch (error: any) {
    //         setMenus([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useLayoutEffect(() => {
    //     const navbar: HTMLElement | null = document.querySelector(".navbar");
    //     const height = navbar ? navbar.offsetHeight : 58;
    //     setNavbarHeight(height);
    //     if (menus.length === 0) fetchMenus();
    // }, []);

    // if (loading) {
    //     return (
    //         <div
    //             style={{
    //                 height: `calc(100dvh - ${navbarHeight}px)`,
    //                 width: "100dvw",
    //             }}
    //             className="d-flex justify-content-center align-items-center"
    //         >
    //             <box-icon name="loader" animation="spin" size="lg"></box-icon>
    //         </div>
    //     );
    // }

    // Check if the user's role is in the allowed roles for this route
    return menus.map((menu) => menu.name).includes(menu.toUpperCase()) ? (
        element
    ) : (
        <Navigate to="/403" />
    );
};

export default PrivateRoute;
