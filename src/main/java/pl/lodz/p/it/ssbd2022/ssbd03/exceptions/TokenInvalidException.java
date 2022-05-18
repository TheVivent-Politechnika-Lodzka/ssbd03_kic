package pl.lodz.p.it.ssbd2022.ssbd03.exceptions;

import jakarta.ejb.ApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationException(rollback = true)
public class TokenInvalidException extends AppBaseException{


    private static final String MESSAGE = "server.error.appBase.tokenInvalid";

    public TokenInvalidException() {
        super(MESSAGE, Response.Status.BAD_REQUEST);
    }

}
