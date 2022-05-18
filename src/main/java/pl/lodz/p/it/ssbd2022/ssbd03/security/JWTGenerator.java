package pl.lodz.p.it.ssbd2022.ssbd03.security;


import io.jsonwebtoken.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.security.enterprise.identitystore.CredentialValidationResult;
import pl.lodz.p.it.ssbd2022.ssbd03.common.Config;

import java.text.ParseException;
import java.time.Instant;
import java.util.Date;

@ApplicationScoped
public class JWTGenerator {

    public  String createJWT(CredentialValidationResult cred) {

        String token = Jwts.builder().
                setSubject(cred.getCallerPrincipal().getName())
                .claim("auth", String.join(",", cred.getCallerGroups()))
                .signWith(SignatureAlgorithm.HS256, Config.JWT_SECRET)
                .setExpiration(new Date(new Date().getTime() + Config.JWT_EXPIRATION_SECONDS)).compact();
        return token;
    }

    public String createJWTForEmail(String login, Instant date) {
        String token = Jwts.builder()
                .setSubject(login)
                .signWith(SignatureAlgorithm.HS256, Config.JWT_SECRET)
                .setExpiration(Date.from(date)).compact();
        return token;
    }

    public  Claims decodeJWT(String jwt) {
        //chwilowe rozwiazanie
        //Ta linia rzuci wyjątek jeśli token nie jest podpisany jak powinien.
        return Jwts.parser()
                .setSigningKey(Config.JWT_SECRET)
                .parseClaimsJws(jwt)
                .getBody();
    }
}

