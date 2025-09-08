package ecommerce.userprofile.profile.domain.specifications;

import ecommerce.userprofile.shared.domain.Specification;
import ecommerce.userprofile.shared.types.IsoCountry;

public interface PhoneNumberSpecification extends Specification<String> {
    String normalize(String phoneNumber);

    IsoCountry getIsoCountry();
}