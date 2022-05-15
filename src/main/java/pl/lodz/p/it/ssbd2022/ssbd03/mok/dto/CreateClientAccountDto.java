package pl.lodz.p.it.ssbd2022.ssbd03.mok.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateClientAccountDto extends AccountDto {

    @NotNull
    private String password;

    @NotNull
    private String login;

    @NotNull
    @Email
    private String email;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    @NotNull
    private boolean isActive;

    @NotNull
    private boolean isConfirmed;

    @NotNull
    private String phone_number;

    @NotNull
    private String pesel;

}
