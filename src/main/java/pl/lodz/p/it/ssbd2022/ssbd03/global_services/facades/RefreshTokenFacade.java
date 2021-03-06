package pl.lodz.p.it.ssbd2022.ssbd03.global_services.facades;

import jakarta.annotation.security.PermitAll;
import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.inject.Inject;
import jakarta.interceptor.Interceptors;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.Getter;
import pl.lodz.p.it.ssbd2022.ssbd03.common.AbstractFacade;
import pl.lodz.p.it.ssbd2022.ssbd03.entities.tokens.RefreshToken;
import pl.lodz.p.it.ssbd2022.ssbd03.interceptors.TrackerInterceptor;
import pl.lodz.p.it.ssbd2022.ssbd03.security.Tagger;

import java.time.Instant;
import java.util.List;

@Interceptors(TrackerInterceptor.class)
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class RefreshTokenFacade extends AbstractFacade<RefreshToken> {

    private static final long serialVersionUID = 1L;

    @PersistenceContext(unitName = "ssbd03mokPU")
    @Getter
    private EntityManager entityManager;

    @Inject
    @Getter
    private Tagger tagger;

    /**
     * Konstruktor
     */
    public RefreshTokenFacade() {
        super(RefreshToken.class);
    }

    /**
     * Metoda usuwa token z bazy danych
     *
     * @param refreshToken - token służący do odświerzania
     */
    @Override
    @PermitAll
    public void unsafeRemove(RefreshToken refreshToken) {
        super.unsafeRemove(refreshToken);
    }

    /**
     * Metoda zwraca tokeny przed podaną datą
     *
     * @return List<RefreshToken> - Zwraca listę wygasłych tokenów
     */
    @PermitAll
    public List<RefreshToken> findExpiredTokens() {
        TypedQuery<RefreshToken> typedQuery = entityManager.createNamedQuery("RefreshToken.findExpired", RefreshToken.class);
        typedQuery.setParameter("now", Instant.now());
        return typedQuery.getResultList();
    }

}
