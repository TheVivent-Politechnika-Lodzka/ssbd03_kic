import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { JWT } from "../../api/types/common";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useStoreDispatch } from "../../redux/reduxHooks";
import { logout } from "../../redux/userSlice";
import styles from "./style.module.scss";

const PageLayout = () => {
    const location = useLocation();
    const dispatch = useStoreDispatch();

    //TODO: Ogarnąć refresh tokena
    useEffect(() => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (token) {
            const result: JWT = jwtDecode(token as string);
            const date = Math.floor(new Date().getTime() / 1000);

            if (result.exp < date) {
                localStorage.removeItem("ACCESS_TOKEN");
                dispatch(logout());
            }
        }
    }, [location.pathname]);

    return (
        <div className={styles.page_layout}>
            <div className={styles.sidebar_wrapper}>
                <Sidebar />
            </div>
            <div className={styles.content_wrapper}>
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
};

export default PageLayout;
