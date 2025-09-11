package ecommerce.userprofile.profile.domain.types;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProfileFieldType {
    FIRST_NAME("firstName", "First name"),
    MIDDLE_NAME("middleName", "Middle name"),
    LAST_NAME("lastName", "Last name"),
    USERNAME("username", "Username"),
    PHONE_NUMBER("phoneNumber", "Phone number"),
    AVATAR("avatar", "Avatar"),
    DATE_OF_BIRTH("dateOfBirth", "Date of birth"),
    GENDER("gender", "Gender");

    private final String fieldName;
    private final String displayName;
}
