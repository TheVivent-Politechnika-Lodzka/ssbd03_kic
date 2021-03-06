import { useEffect, useState } from "react";
import ImplantReview from "../../../../components/ImplantReview/ImplantReview";
import Modal from "../../../../components/shared/Modal/Modal";
import ReactLoading from "react-loading";
import styles from "./style.module.scss";
import {
    getImplantsReviews,
    GetImplantsReviewsResponse,
} from "../../../../api";
import { showNotification } from "@mantine/notifications";
import { failureNotificationItems } from "../../../../utils/showNotificationsItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../../../components/Pagination/Pagination";
import { useTranslation } from "react-i18next";

interface ImplantReviewsListPageProps {
    isOpened: boolean;
    onClose: () => void;
    implantId: string;
}

const ImplantReviewsListPage = ({
    isOpened,
    onClose,
    implantId,
}: ImplantReviewsListPageProps) => {
    const [reviews, setReviews] = useState<GetImplantsReviewsResponse>();
    const [loading, setLoading] = useState<Loading>({
        pageLoading: true,
        actionLoading: false,
    });
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        pageSize: 1,
        totalPages: 1,
    });

    const handleGetImplantReviews = async () => {
        if (!implantId) return;
        setLoading({ ...loading, pageLoading: true });
        const data = await getImplantsReviews({
            implantId,
            page: pagination.currentPage as number,
            size: pagination.pageSize as number,
        });
        if ("errorMessage" in data) {
            setLoading({ ...loading, pageLoading: false });
            showNotification(failureNotificationItems(data.errorMessage));
            return;
        }
        setReviews(data);
        setLoading({ ...loading, pageLoading: false });
    };

    const { t } = useTranslation();

    useEffect(() => {
        handleGetImplantReviews();
    }, [isOpened, pagination]);

    return (
        <Modal isOpen={isOpened}>
            {loading.pageLoading ? (
                <ReactLoading
                    type="bars"
                    color="#fff"
                    width="10rem"
                    height="10rem"
                />
            ) : (
                <div className={styles.implants_reviews_list_page}>
                    <FontAwesomeIcon
                        className={styles.close_icon}
                        icon={faClose}
                        onClick={onClose}
                    />
                    <div className={styles.reviews_wrapper}>
                        {reviews?.data.map((review) => (
                            <ImplantReview
                                key={review?.id}
                                review={review}
                                onClose={onClose}
                            />
                        ))}

                        {reviews?.data.length === 0 && (
                            <p className={styles.no_reviews}>
                                {t("addImplantReviewPage.reviewsNotFound")}
                            </p>
                        )}
                    </div>
                    {reviews?.data.length !== 0 && (
                        <Pagination
                            pagination={pagination}
                            handleFunction={setPagination}
                        />
                    )}
                </div>
            )}
        </Modal>
    );
};

export default ImplantReviewsListPage;
