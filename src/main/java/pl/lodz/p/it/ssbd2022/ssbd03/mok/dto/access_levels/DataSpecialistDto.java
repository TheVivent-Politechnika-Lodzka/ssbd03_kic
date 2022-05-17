package pl.lodz.p.it.ssbd2022.ssbd03.mok.dto.access_levels;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import pl.lodz.p.it.ssbd2022.ssbd03.validation.PhoneNumber;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class DataSpecialistDto extends AccessLevelDto {

    @NotNull
    @Email
    String contactEmail;
    @PhoneNumber
    String phoneNumber;

}
