package pl.lodz.p.it.ssbd2022.ssbd03.common;

import jakarta.ejb.Local;

@Local
public interface ServiceLocalInterface {
    public boolean isLastTransactionCommited();
}
