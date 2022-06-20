import { Route } from "react-router-dom";
import ChangeUserPassword from "../pages/protected/admin/ChangeUserPassword/ChangeUserPassword";
import CreateUserPage from "../pages/protected/admin/CreateUserPage";
import EditAnyAccountPage from "../pages/protected/admin/EditAnyAccountPage/EditAnyAccountPage";
import UserManagment from "../pages/protected/admin/UsersManagmentPage/UsersManagmentPage";
import { OwnAppointmentsList } from "../pages/protected/shared/OwnAppointmentsList/OwnAppointmentsList";
import { AppointmentListPage } from "../pages/protected/admin/AppointmentList";
import { CreateImplantPage } from "../pages/protected/admin/CreateImplantPage";

const authorizedRoutes = (accessLevel: AccessLevelType) => {
    switch (accessLevel) {
        case "ADMINISTRATOR": {
            return (
                <>
                    <Route path="/accounts" element={<UserManagment />} />
                    <Route
                        path="/accounts/:login"
                        element={<EditAnyAccountPage />}
                    />
                    <Route
                        path="/accounts/:login/change-password"
                        element={<ChangeUserPassword />}
                    />
                    <Route path="/visits" element={<AppointmentListPage />} />
                    <Route
                        path="/accounts/create-account"
                        element={<CreateUserPage />}
                    />
                    <Route
                        path="/create-implant"
                        element={<CreateImplantPage />}
                    />
                </>
            );
        }
        case "SPECIALIST": {
            return (
                <>
                    <Route path="/visits" element={<OwnAppointmentsList />} />
                </>
            );
        }
        case "CLIENT": {
            return (
                <>
                    <Route path="/visits" element={<OwnAppointmentsList />} />
                </>
            );
        }
        default: {
            return <></>;
        }
    }
};

export default authorizedRoutes;
