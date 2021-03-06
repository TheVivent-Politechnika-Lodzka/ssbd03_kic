import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
    editAnyAccount,
    getAccount,
    GetAccountResponse,
} from "../../../../api";
import ReactLoading from "react-loading";
import { failureNotificationItems } from "../../../../utils/showNotificationsItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import avatar from "../../../../assets/images/avatar.jpg";
import { faCancel, faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import InputWithValidation from "../../../../components/shared/InputWithValidation/InputWithValidation";
import ValidationMessage from "../../../../components/shared/ValidationMessage/ValidationMessage";
import ActionButton from "../../../../components/shared/ActionButton/ActionButton";
import { validationContext } from "../../../../context/validationContext";
import { showNotification } from "@mantine/notifications";
import { successNotficiationItems } from "../../../../utils/showNotificationsItems";
import ConfirmActionModal from "../../../../components/shared/ConfirmActionModal/ConfirmActionModal";
import styles from "./style.module.scss";
import { uploadPhoto } from "../../../../utils/upload";

const EditAnyAccountPage = () => {
    const [account, setAccount] = useState<GetAccountResponse>();
    const accountAccessLevels = account?.accessLevels.map(
        (level) => level.level
    );

    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState<Loading>({
        pageLoading: true,
        actionLoading: false,
    });
    const navigate = useNavigate();
    const { login } = useParams();
    const { t } = useTranslation();
    const {
        state: {
            isFirstNameValid,
            isLastNameValid,
            isPhoneNumberValidAdministrator,
            isPhoneNumberValidSpecialist,
            isPhoneNumberValidClient,
            isPESELValid,
            isEmailValidAdministrator,
            isEmailValidSpecialist,
        },
    } = useContext(validationContext);

    useEffect(() => {
        handleGetUser();
    }, []);

    const handleGetUser = async () => {
        if (!login) return;
        setLoading({ ...loading, pageLoading: true });
        const response = await getAccount(login);
        if ("errorMessage" in response) {
            showNotification(failureNotificationItems(response.errorMessage));
            setLoading({ ...loading, pageLoading: false });
            return;
        }
        setAccount(response);
        setLoading({ ...loading, pageLoading: false });
    };

    const handleSubmit = async () => {
        setLoading({ ...loading, actionLoading: true });
        if (!account || !login) return;
        const response = await editAnyAccount(login, account);
        if ("errorMessage" in response) {
            showNotification(failureNotificationItems(response.errorMessage));
            setLoading({ ...loading, actionLoading: false });
            return;
        }
        showNotification(
            successNotficiationItems(t("editAnyAccountPage.updateSuccessfully"))
        );
        setAccount(response);
        setLoading({ ...loading, actionLoading: false });
        navigate("/accounts");
    };

    const isEveryFieldValid =
        isFirstNameValid &&
        isLastNameValid &&
        (accountAccessLevels?.includes("ADMINISTRATOR")
            ? isPhoneNumberValidAdministrator && isEmailValidAdministrator
            : true) &&
        (accountAccessLevels?.includes("SPECIALIST")
            ? isPhoneNumberValidSpecialist && isEmailValidSpecialist
            : true) &&
        (accountAccessLevels?.includes("CLIENT")
            ? isPhoneNumberValidClient && isPESELValid
            : true);

    return (
        <section className={styles.edit_own_account_page}>
            {loading.pageLoading ? (
                <ReactLoading
                    type="cylon"
                    color="#fff"
                    width="10rem"
                    height="10rem"
                />
            ) : (
                <>
                    <div className={styles.edit_own_account_header}>
                        <h2>
                            {t("editAnyAccountPage.editAccount")} {login}
                        </h2>
                    </div>
                    <div className={styles.edit_own_account_content}>
                        <div className={styles.edit_data_account_wrapper}>
                            <div className={styles.avatar_wrapper}>
                                <img
                                    src={account?.url}
                                    alt="User avatar"
                                    className={styles.change_avatar}
                                />
                                {/* <input
                                    id="file-input"
                                    type="file"
                                    onChange={async (event) => {
                                        const u = await uploadPhoto(event);
                                        if (u) {
                                            if (account !== undefined) {
                                                setAccount({
                                                    ...account,
                                                    url: u,
                                                });
                                            }
                                        }
                                    }}
                                /> 
                                <div
                                    className={styles.edit_avatar_icon_wrapper}
                                >
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className={styles.edit_avatar_icon}
                                    />
                                </div>*/}
                            </div>
                            <div className={styles.edit_fields_wrapper}>
                                <div className={styles.edit_field}>
                                    <InputWithValidation
                                        title={t(
                                            "editAnyAccountPage.editAccount"
                                        )}
                                        value={account?.firstName}
                                        validationType="VALIDATE_FIRSTNAME"
                                        isValid={isFirstNameValid}
                                        onChange={(e) => {
                                            if (e.target.value && account)
                                                setAccount({
                                                    ...account,
                                                    firstName: e.target.value,
                                                });
                                        }}
                                    />
                                    <ValidationMessage
                                        isValid={isFirstNameValid}
                                        message={t(
                                            "editAnyAccountPage.firstNameMsg"
                                        )}
                                    />
                                </div>
                                <div className={styles.edit_field}>
                                    <InputWithValidation
                                        title={t("editAnyAccountPage.lastName")}
                                        value={account?.lastName}
                                        validationType="VALIDATE_LASTNAME"
                                        isValid={isLastNameValid}
                                        onChange={(e) => {
                                            if (e.target.value && account)
                                                setAccount({
                                                    ...account,
                                                    lastName: e.target.value,
                                                });
                                        }}
                                    />
                                    <ValidationMessage
                                        isValid={isLastNameValid}
                                        message={t(
                                            "editAnyAccountPage.lastNameMsg"
                                        )}
                                    />
                                </div>

                                {accountAccessLevels?.includes("CLIENT") && (
                                    <>
                                        <p
                                            className={
                                                styles.access_level_name_header
                                            }
                                        >
                                            {t(
                                                "editAnyAccountPage.editForClient"
                                            )}
                                        </p>
                                        <div className={styles.edit_field}>
                                            <InputWithValidation
                                                title="Pesel"
                                                value={
                                                    account?.accessLevels
                                                        .filter(
                                                            (level) =>
                                                                level.level ===
                                                                "CLIENT"
                                                        )
                                                        .map(
                                                            (level) =>
                                                                level.pesel
                                                        )[0]
                                                }
                                                validationType="VALIDATE_PESEL"
                                                isValid={isPESELValid}
                                                onChange={(e) => {
                                                    if (
                                                        e.target.value &&
                                                        account
                                                    )
                                                        setAccount((old) => {
                                                            if (!old) return;
                                                            old.accessLevels.forEach(
                                                                (level) => {
                                                                    if (
                                                                        level.level ===
                                                                        "CLIENT"
                                                                    ) {
                                                                        level.pesel =
                                                                            e.target.value;
                                                                    }
                                                                }
                                                            );
                                                            return old;
                                                        });
                                                }}
                                            />
                                            <ValidationMessage
                                                isValid={isPESELValid}
                                                message={t(
                                                    "editAnyAccountPage.peselMsg"
                                                )}
                                            />
                                        </div>
                                        <div className={styles.edit_field}>
                                            <InputWithValidation
                                                title={t(
                                                    "editAnyAccountPage.phoneNumber"
                                                )}
                                                value={
                                                    account?.accessLevels
                                                        .filter(
                                                            (level) =>
                                                                level.level ===
                                                                "CLIENT"
                                                        )
                                                        .map(
                                                            (level) =>
                                                                level.phoneNumber
                                                        )[0]
                                                }
                                                validationType="VALIDATE_PHONENUMBER_CLIENT"
                                                isValid={
                                                    isPhoneNumberValidClient
                                                }
                                                onChange={(e) => {
                                                    if (
                                                        e.target.value &&
                                                        account
                                                    )
                                                        setAccount((old) => {
                                                            if (!old) return;
                                                            old.accessLevels.forEach(
                                                                (level) => {
                                                                    if (
                                                                        level.level ===
                                                                        "CLIENT"
                                                                    )
                                                                        level.phoneNumber =
                                                                            e.target.value;
                                                                }
                                                            );
                                                            return old;
                                                        });
                                                }}
                                            />
                                            <ValidationMessage
                                                isValid={
                                                    isPhoneNumberValidClient
                                                }
                                                message={t(
                                                    "editAnyAccountPage.phoneNumberMsg"
                                                )}
                                            />
                                        </div>
                                    </>
                                )}

                                {accountAccessLevels?.includes(
                                    "ADMINISTRATOR"
                                ) && (
                                    <>
                                        <p
                                            className={
                                                styles.access_level_name_header
                                            }
                                        >
                                            {t(
                                                "editAnyAccountPage.editForAdmin"
                                            )}
                                        </p>
                                        <div className={styles.edit_field}>
                                            <InputWithValidation
                                                title={t(
                                                    "editAnyAccountPage.phoneNumber"
                                                )}
                                                value={
                                                    account?.accessLevels
                                                        .filter(
                                                            (level) =>
                                                                level.level ===
                                                                "ADMINISTRATOR"
                                                        )
                                                        .map(
                                                            (level) =>
                                                                level.phoneNumber
                                                        )[0]
                                                }
                                                validationType="VALIDATE_PHONENUMBER_ADMINISTRATOR"
                                                isValid={
                                                    isPhoneNumberValidAdministrator
                                                }
                                                onChange={(e) => {
                                                    if (
                                                        e.target.value &&
                                                        account
                                                    )
                                                        setAccount((old) => {
                                                            if (!old) return;
                                                            old.accessLevels.forEach(
                                                                (level) => {
                                                                    if (
                                                                        level.level ===
                                                                        "ADMINISTRATOR"
                                                                    )
                                                                        level.phoneNumber =
                                                                            e.target.value;
                                                                }
                                                            );
                                                            return old;
                                                        });
                                                }}
                                            />
                                            <ValidationMessage
                                                isValid={
                                                    isPhoneNumberValidAdministrator
                                                }
                                                message={t(
                                                    "editAnyAccountPage.phoneNumber"
                                                )}
                                            />
                                        </div>
                                        <div className={styles.edit_field}>
                                            <InputWithValidation
                                                title={t(
                                                    "editAnyAccountPage.email"
                                                )}
                                                value={
                                                    account?.accessLevels
                                                        .filter(
                                                            (level) =>
                                                                level.level ===
                                                                "ADMINISTRATOR"
                                                        )
                                                        .map(
                                                            (level) =>
                                                                level.contactEmail
                                                        )[0]
                                                }
                                                validationType="VALIDATE_EMAIL_ADMINISTRATOR"
                                                isValid={
                                                    isEmailValidAdministrator
                                                }
                                                onChange={(e) => {
                                                    if (
                                                        e.target.value &&
                                                        account
                                                    )
                                                        setAccount((old) => {
                                                            if (!old) return;
                                                            old.accessLevels.forEach(
                                                                (level) => {
                                                                    if (
                                                                        level.level ===
                                                                        "ADMINISTRATOR"
                                                                    )
                                                                        level.contactEmail =
                                                                            e.target.value;
                                                                }
                                                            );
                                                            return old;
                                                        });
                                                }}
                                            />
                                            <ValidationMessage
                                                isValid={
                                                    isEmailValidAdministrator
                                                }
                                                message={t(
                                                    "editAnyAccountPage.emailMsg"
                                                )}
                                            />
                                        </div>
                                    </>
                                )}

                                {accountAccessLevels?.includes(
                                    "SPECIALIST"
                                ) && (
                                    <>
                                        <p
                                            className={
                                                styles.access_level_name_header
                                            }
                                        >
                                            {t(
                                                "editAnyAccountPage.editForSpec"
                                            )}
                                        </p>
                                        <div className={styles.edit_field}>
                                            <InputWithValidation
                                                title={t(
                                                    "editAnyAccountPage.phoneNumber"
                                                )}
                                                value={
                                                    account?.accessLevels
                                                        .filter(
                                                            (level) =>
                                                                level.level ===
                                                                "SPECIALIST"
                                                        )
                                                        .map(
                                                            (level) =>
                                                                level.phoneNumber
                                                        )[0]
                                                }
                                                validationType="VALIDATE_PHONENUMBER_SPECIALIST"
                                                isValid={
                                                    isPhoneNumberValidSpecialist
                                                }
                                                onChange={(e) => {
                                                    if (
                                                        e.target.value &&
                                                        account
                                                    )
                                                        setAccount((old) => {
                                                            if (!old) return;
                                                            old.accessLevels.forEach(
                                                                (level) => {
                                                                    if (
                                                                        level.level ===
                                                                        "SPECIALIST"
                                                                    )
                                                                        level.phoneNumber =
                                                                            e.target.value;
                                                                }
                                                            );
                                                            return old;
                                                        });
                                                }}
                                            />
                                            <ValidationMessage
                                                isValid={
                                                    isPhoneNumberValidSpecialist
                                                }
                                                message={t(
                                                    "editAnyAccountPage.phoneNumberMsg"
                                                )}
                                            />
                                        </div>
                                        <div className={styles.edit_field}>
                                            <InputWithValidation
                                                title={t(
                                                    "editAnyAccountPage.email"
                                                )}
                                                value={
                                                    account?.accessLevels
                                                        .filter(
                                                            (level) =>
                                                                level.level ===
                                                                "SPECIALIST"
                                                        )
                                                        .map(
                                                            (level) =>
                                                                level.contactEmail
                                                        )[0]
                                                }
                                                validationType="VALIDATE_EMAIL_SPECIALIST"
                                                isValid={isEmailValidSpecialist}
                                                onChange={(e) => {
                                                    if (
                                                        e.target.value &&
                                                        account
                                                    )
                                                        setAccount((old) => {
                                                            if (!old) return;
                                                            old.accessLevels.forEach(
                                                                (level) => {
                                                                    if (
                                                                        level.level ===
                                                                        "SPECIALIST"
                                                                    )
                                                                        level.contactEmail =
                                                                            e.target.value;
                                                                }
                                                            );
                                                            return old;
                                                        });
                                                }}
                                            />
                                            <ValidationMessage
                                                isValid={isEmailValidSpecialist}
                                                message={t(
                                                    "editAnyAccountPage.emailMsg"
                                                )}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={styles.edit_data_buttons_wrapper}>
                                <ActionButton
                                    onClick={() => {
                                        setOpened(true);
                                    }}
                                    isDisabled={!isEveryFieldValid}
                                    icon={faCheck}
                                    color="green"
                                    title={t("editAnyAccountPage.confirm")}
                                />
                                <ActionButton
                                    onClick={() => {
                                        navigate("/accounts");
                                    }}
                                    icon={faCancel}
                                    color="red"
                                    title={t("editAnyAccountPage.cancel")}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
            <ConfirmActionModal
                isOpened={opened}
                onClose={() => {
                    setOpened(false);
                }}
                handleFunction={async () => {
                    await handleSubmit();
                    setOpened(false);
                }}
                isLoading={loading.actionLoading ?? false}
                title={t("editAnyAccountPage.editAccount")}
            >
                {t("editAnyAccountPage.editAccount")}
            </ConfirmActionModal>
        </section>
    );
};

export default EditAnyAccountPage;
