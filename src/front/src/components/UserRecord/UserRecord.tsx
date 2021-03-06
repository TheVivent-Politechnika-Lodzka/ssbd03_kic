import {
    faCancel,
    faCheck,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useStoreSelector } from "../../redux/reduxHooks";
import AccountDetails from "../../pages/protected/admin/AccountDetailsPage/AccountDetailsPage";
import AccessLevel from "../shared/AccessLevel/AccessLevel";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";

interface UserRecordProps {
    user: AccountDetails;
    handleChange: (change: boolean) => void;
}

const UserRecord = ({ user, handleChange }: UserRecordProps) => {
    const [modal, setModal] = useState<boolean>(false);
    const login = useStoreSelector((state) => state.user.sub);
    const accessLevel = useStoreSelector((state) => state.user.cur);

    const { t } = useTranslation();

    useEffect(() => {
        handleChange(true);
    }, [modal]);

    return (
        <div className={styles.user_record_wrapper}>
            <div className={styles.avatar_wrapper}>
                <img
                    className={styles.avatar}
                    src={user?.url}
                    alt={t("userRecord.alt")}
                />
                <div className={styles.access_levels_wrapper}>
                    {user?.accessLevels.map((accessLevel, index) => (
                        <AccessLevel
                            key={user?.login + index}
                            accessLevel={accessLevel?.level}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.detail_wrapper}>
                <p className={styles.detail}>{user?.login}</p>
            </div>
            <div className={styles.detail_wrapper}>
                <p className={styles.detail}>{user?.firstName}</p>
            </div>
            <div className={styles.detail_wrapper}>
                <p className={styles.detail}>{user?.lastName}</p>
            </div>
            <div className={styles.detail_wrapper}>
                <FontAwesomeIcon
                    className={
                        user?.confirmed
                            ? styles.icon_confirmed
                            : styles.icon_not_confirmed
                    }
                    icon={user?.confirmed ? faCheck : faCancel}
                />
                <p className={styles.detail}>
                    {user?.confirmed
                        ? t("userRecord.approved")
                        : t("userRecord.unapproved")}
                </p>
            </div>
            <div className={styles.detail_wrapper}>
                <div
                    className={`${styles.is_active_circle} ${
                        user?.active ? styles.active : styles.inactive
                    } `}
                />
                <p className={styles.detail}>
                    {user?.active
                        ? t("userRecord.active")
                        : t("userRecord.inactive")}
                </p>
            </div>
            <div className={styles.detail_wrapper}>
                <div
                    className={styles.info_button}
                    onClick={() => {
                        setModal(true);
                    }}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                </div>
            </div>
            <AccountDetails
                login={user?.login}
                isAdmin={
                    accessLevel === "ADMINISTRATOR" && user?.login === login
                }
                isOpened={modal}
                onClose={() => {
                    setModal(false);
                }}
            />
        </div>
    );
};

export default UserRecord;
