package ecommerce.userprofile.profile.domain.factories;

import ecommerce.userprofile.profile.domain.specifications.BulgarianPhoneNumberSpecification;
import ecommerce.userprofile.profile.domain.specifications.PhoneNumberSpecification;
import ecommerce.userprofile.shared.exceptions.DomainException;
import ecommerce.userprofile.shared.types.IsoCountry;
import org.jetbrains.annotations.NotNull;

public class PhoneNumberSpecificationFactory {

    public static final String UNSUPPORTED_COUNTRY_MESSAGE = "Unsupported country: %s";

    public PhoneNumberSpecification getSpecification(@NotNull IsoCountry isoCountry) {
        return switch (isoCountry) {
            case BULGARIA -> new BulgarianPhoneNumberSpecification();

            default -> throw new DomainException(String.format(UNSUPPORTED_COUNTRY_MESSAGE, isoCountry));
        };
    }
}
