package pl.lodz.p.it.ssbd2022.ssbd03.security;

import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.security.enterprise.identitystore.DatabaseIdentityStoreDefinition;
import jakarta.security.enterprise.identitystore.IdentityStore;
import pl.lodz.p.it.ssbd2022.ssbd03.utils.HashAlgorithm;

@DatabaseIdentityStoreDefinition(
        dataSourceLookup = "java:app/jdbc/ssbd03auth",
        callerQuery = "SELECT DISTINCT password FROM auth_view WHERE login = ?",
        groupsQuery = "SELECT access_level FROM auth_view WHERE login = ?",
        hashAlgorithm = HashAlgorithm.class
)
@ApplicationScoped
public class AuthenticationIdentityStore implements IdentityStore {

    private static final long serialVersionUID = 1L;

}
