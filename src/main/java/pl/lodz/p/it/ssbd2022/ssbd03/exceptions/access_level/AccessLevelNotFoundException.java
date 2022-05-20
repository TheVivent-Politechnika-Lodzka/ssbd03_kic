package pl.lodz.p.it.ssbd2022.ssbd03.exceptions.access_level;

import jakarta.ejb.ApplicationException;
import jakarta.ws.rs.core.Response;
import pl.lodz.p.it.ssbd2022.ssbd03.exceptions.AppBaseException;

// TODO: Dodanie Javadoc
@ApplicationException(rollback = true)
public class AccessLevelNotFoundException extends AppBaseException {

    private static final String MESSAGE = "server.error.appBase.accessLevelNotFound";


    public AccessLevelNotFoundException() {
        super(MESSAGE, Response.Status.NOT_FOUND);
    }


}