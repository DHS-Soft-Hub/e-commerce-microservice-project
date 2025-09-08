package ecommerce.userprofile.profile.domain.valueobjects;

import ecommerce.userprofile.profile.domain.types.GenderTypes;
import ecommerce.userprofile.shared.domain.valueobject.ValueObject;
import ecommerce.userprofile.shared.exceptions.DomainException;

/**
 * Value object representing user gender with type safety validation.
 * Supports MALE, FEMALE, and OTHER gender types.
 */
public record Gender(GenderTypes value) implements ValueObject<GenderTypes> {

    /**
     * Error message for null gender values
     */
    public static final String NULL_GENDER_MESSAGE = "Gender cannot be null";

    /**
     * Creates a validated gender from the provided gender type.
     *
     * @throws DomainException if a gender type is null
     */
    public Gender {
        validate(value);
    }

    /**
     * Validates the gender type against null constraints.
     *
     * @param value the gender type to validate
     * @throws DomainException if validation fails
     */
    @Override
    public void validate(GenderTypes value) {
        if (value == null) throw new DomainException(NULL_GENDER_MESSAGE);
    }
}
