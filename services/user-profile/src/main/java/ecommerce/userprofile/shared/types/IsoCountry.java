package ecommerce.userprofile.shared.types;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Enum for supported countries in the system
 */
@Getter
@AllArgsConstructor
public enum IsoCountry {
    BULGARIA("България", "BG", "BGR", "359");

    private final String name;
    private final String alpha2Code;
    private final String alpha3Code;
    private final String dialCode;
}
