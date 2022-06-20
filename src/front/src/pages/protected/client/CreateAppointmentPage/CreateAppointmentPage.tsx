import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import style from "./style.module.scss";
import { Calendar } from "@mantine/dates";
import ActionButton from "../../../../components/shared/ActionButton/ActionButton";
import {
    getImplant,
    GetImplantResponse,
    listSpecialist,
    SpecialistListElementDto,
    SpecialistListResponse,
} from "../../../../api/mop";
import { showNotification } from "@mantine/notifications";
import {
    failureNotificationItems,
    successNotficiationItems,
} from "../../../../utils/showNotificationsItems";

const CreateAppointmentPage = () => {
    const { implantId } = useParams();
    const navigate = useNavigate();
    const [specialistList, setSpecialistList] =
        useState<SpecialistListElementDto[]>(); // TODO zmienić na GetSpecialistListResponse
    const [specialist, setSpecialist] = useState<any>(); // TODO zmienić na GetSpecialistResponse

    const handleLoadSpecialistList = async () => {
        const response = await listSpecialist({ size: 5, page: 1, phrase: "" });
        if ("errorMessage" in response) {
            showNotification(failureNotificationItems(response.errorMessage));
            return;
        }
        setSpecialistList(response.data);
    };

    useEffect(() => {
        handleLoadSpecialistList();
    }, []);

    return (
        <section className={style.create_appointment_page}>
            <h1>Zarezerwuj wizytę</h1>
            <div className={style.appointment_container}>
                <div className={style.implant_display}>
                    <ImplantItem implantId={implantId} />
                </div>
                <div className={style.bottom_wrapper}>
                    <div className={style.specialist_display}>
                        {specialistList?.map((spec: any) => (
                            <SpecialistItem
                                key={spec.id}
                                specialist={spec}
                                onClick={setSpecialist}
                            />
                        ))}
                    </div>
                    <div className={style.date_display}>
                        <Calendar size="xl" className={style.calendar} />
                        <div className={style.right_to_calendar}>
                            <div className={style.pick_hour}>pick hour</div>
                            <div className={style.create_appointment}>
                                <ActionButton
                                    onClick={() => {
                                        navigate(
                                            `/implant/${implantId}/create-appointment`
                                        );
                                    }}
                                    title="Przejdź do podsumowania"
                                    color="green"
                                    icon={faShoppingCart}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateAppointmentPage;

interface ImplantItemProps {
    implantId: string | undefined;
}
const ImplantItem = ({ implantId }: ImplantItemProps) => {
    const id = implantId;
    const [implant, setImplant] = useState<GetImplantResponse>();

    const handleLoadImplant = async () => {
        if (!id) return;
        const response = await getImplant(id);
        if ("errorMessage" in response) {
            showNotification(failureNotificationItems(response.errorMessage));
            return;
        }
        console.log(response);
        setImplant(response);
    };

    useEffect(() => {
        handleLoadImplant();
    }, [id]);

    return (
        <div className={style.implant}>
            <img
                className={style.implant_image}
                src={implant?.image}
                alt="implant"
            />
            <div className={style.implant_title}>
                <h2>{implant?.name}</h2>
                <div className={style.implant_price_tag}>{implant?.price}</div>
            </div>
        </div>
    );
};

interface SpecialistItemInterface {
    specialist: any;
    onClick: (specialist: any) => void;
}
const SpecialistItem = ({ onClick, specialist }: SpecialistItemInterface) => {
    const spec = specialist;

    const handleClick = () => {
        onClick(spec);
    };

    return (
        <div className={style.specialist_item} onClick={handleClick}>
            <div>
                <img src={spec.imageUrl} alt="specialist" />
            </div>
            <div>
                <h3>
                    {spec.firstName} {spec.lastName}
                </h3>
            </div>
        </div>
    );
};
