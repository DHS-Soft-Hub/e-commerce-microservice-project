package ecommerce.userprofile.profile.domain.valueobjects;

import ecommerce.userprofile.profile.domain.specifications.PhoneNumberSpecification;
import ecommerce.userprofile.shared.base.ValueObject;
import ecommerce.userprofile.shared.exceptions.DomainException;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

/**
 * Value object for phone numbers with country-specific validation and normalization.
 * Can only be created through a factory method with proper specification.
 */
public record PhoneNumber(String value, PhoneNumberSpecification specification) implements ValueObject<String> {

    /**
     * Error message for null/blank phone numbers
     */
    public static final String INVALID_PHONE_NUMBER_MESSAGE = "Invalid phone number for country: %s";

    /**
     * Error message for invalid phone numbers
     */
    public static final String REQUIRED_MESSAGE = "Phone number cannot be null or empty";

    /**
     * Private constructor to enforce factory method usage.
     *
     * @param value         the phone number value
     * @param specification the validation specification
     */
    public PhoneNumber(String value, @NotNull PhoneNumberSpecification specification) {
        this.specification = specification;

        String normalizedValue = specification.normalize(value);
        validate(normalizedValue);

        this.value = normalizedValue;
    }

    /**
     * Creates a validated phone number instance.
     *
     * @param value         the phone number to validate
     * @param specification the country-specific validation rules
     * @return validated PhoneNumber instance
     * @throws DomainException if validation fails
     */
    @Contract(value = "_, _ -> new", pure = true)
    public static @NotNull PhoneNumber create(String value, PhoneNumberSpecification specification) {
        return new PhoneNumber(value, specification);
    }

    /**
     * Validates phone number against specification rules.
     *
     * @param value the phone number to validate
     * @throws DomainException if validation fails
     */
    @Override
    public void validate(String value) {
        if (value == null || value.isBlank()) throw new DomainException(REQUIRED_MESSAGE);

        if (!specification.isSatisfiedBy(value))
            throw new DomainException(String.format(INVALID_PHONE_NUMBER_MESSAGE, specification.getIsoCountry().getName()));
    }
}
