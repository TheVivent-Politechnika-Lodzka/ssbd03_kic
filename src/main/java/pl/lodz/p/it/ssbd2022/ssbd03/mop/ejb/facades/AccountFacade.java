package pl.lodz.p.it.ssbd2022.ssbd03.mop.ejb.facades;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.inject.Inject;
import jakarta.interceptor.Interceptors;
import jakarta.persistence.*;
import lombok.Getter;
import pl.lodz.p.it.ssbd2022.ssbd03.common.AbstractFacade;
import pl.lodz.p.it.ssbd2022.ssbd03.common.Roles;
import pl.lodz.p.it.ssbd2022.ssbd03.entities.Account;
import pl.lodz.p.it.ssbd2022.ssbd03.exceptions.InvalidParametersException;
import pl.lodz.p.it.ssbd2022.ssbd03.exceptions.ResourceNotFoundException;
import pl.lodz.p.it.ssbd2022.ssbd03.exceptions.database.DatabaseException;
import pl.lodz.p.it.ssbd2022.ssbd03.interceptors.TrackerInterceptor;
import pl.lodz.p.it.ssbd2022.ssbd03.security.Tagger;
import pl.lodz.p.it.ssbd2022.ssbd03.utils.PaginationData;

import java.util.List;
import java.util.UUID;

@Interceptors(TrackerInterceptor.class)
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class AccountFacade extends AbstractFacade<Account> {

    @PersistenceContext(unitName = "ssbd03mopPU")
    @Getter
    private EntityManager entityManager;

    @Inject
    @Getter
    private Tagger tagger;

    public AccountFacade() {
        super(Account.class);
    }

    /**
     * Metoda wyszukująca konkretne konto względem wprowadzonego loginu
     *
     * @param login Login użytkownika, którego szukamy
     * @return Obiekt znalezionego konta
     * @throws InvalidParametersException, gdy podano niepoprawną wartość parametru
     * @throws DatabaseException, gdy wystąpi błąd związany z bazą danych
     */
    @RolesAllowed(Roles.AUTHENTICATED)
    public Account findByLogin(String login) {
        try {
            TypedQuery<Account> typedQuery = entityManager.createNamedQuery("Account.findByLogin", Account.class);
            typedQuery.setParameter("login", login);
            return typedQuery.getSingleResult();
        } catch (NoResultException e) {
            throw new ResourceNotFoundException();
        } catch (IllegalArgumentException e) {
            throw new InvalidParametersException(e.getCause());
        } catch (PersistenceException e) {
            throw new DatabaseException(e.getCause());
        }
    }

    /**
     * Metoda zwracająca listę specialistów względem wprowadzonej paginacji i frazy
     * dostęp dla wszystkich
     *
     * @param pageNumber - numer strony (int)
     * @param perPage    - liczba rekordów na stronie (int)
     * @param phrase     - fraza do wyszukania (String)
     * @return lista specialistów (PaginationData)
     * @throws  InvalidParametersException przy błędnym podaniu parametrów
     * @throws DatabaseException przy błędzie bazy danych
     */
    @RolesAllowed({Roles.ANONYMOUS, Roles.AUTHENTICATED})
    public PaginationData findInRangeWithPhrase(int pageNumber, int perPage, String phrase) {
        try {
            TypedQuery<Account> typedQuery = entityManager.createNamedQuery("DataSpecialist.searchSpecialistByPhrase", Account.class);
            pageNumber--;
            List<Account> data = typedQuery.setParameter("phrase", "%" + phrase + "%")
                    .setMaxResults(perPage)
                    .setFirstResult(pageNumber * perPage)
                    .getResultList();
            pageNumber++;

            int totalCount = this.count();
            int totalPages = (int) Math.ceil((double) totalCount / perPage);

            return new PaginationData(totalCount, totalPages, pageNumber, data);
        } catch (IllegalArgumentException e) {
            throw new InvalidParametersException(e.getCause());
        } catch (PersistenceException e) {
            throw new DatabaseException(e.getCause());
        }
    }

    /**
     * Metoda wyszukująca konkretne konto względem wprowadzonego id
     *
     * @param id - id użytkownika, którego szukamy
     * @return Obiekt znalezionego konta
     * @throws InvalidParametersException, gdy podano niepoprawną wartość parametru
     * @throws DatabaseException - gdy wystąpi błąd związany z bazą danych
     * @throws ResourceNotFoundException, gdy nie znaleziono zasobu
     */
    @RolesAllowed(Roles.CLIENT)
    public Account findByUUID(UUID id) {
        try {
            TypedQuery<Account> typedQuery = entityManager.createNamedQuery("Account.findById", Account.class);
            typedQuery.setParameter("id", id);
            return typedQuery.getSingleResult();
        } catch (NoResultException e) {
            throw new ResourceNotFoundException();
        } catch (PersistenceException e) {
            throw new DatabaseException(e.getCause());
        }
    }
}
