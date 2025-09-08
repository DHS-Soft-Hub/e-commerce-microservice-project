package ecommerce.userprofile.profile.domain.valueobjects;

import ecommerce.userprofile.shared.base.ValueObject;
import ecommerce.userprofile.shared.exceptions.DomainException;

import java.time.LocalDate;

/**
 * Value object representing a person's date of birth with age and future date validation.
 * Ensures the person is not older than the maximum allowed age and not born in the future.
 */
public record DateOfBirth(LocalDate value) implements ValueObject<LocalDate> {

    /**
     * Maximum allowed age in years
     */
    public static final int MAX_AGE_YEARS = 100;

    /**
     * Error message for null date of birth values
     */
    public static final String REQUIRED = "Date of birth is required";

    /**
     * Error message for future dates
     */
    public static final String FUTURE_DATE_MESSAGE = "Date of birth cannot be in the future";

    /**
     * Error message for dates older than the maximum allowed age
     */
    public static final String TOO_OLD_MESSAGE = "Date of birth cannot be more than %d years ago";

    /**
     * Creates a validated date of birth from the provided date.
     *
     * @throws DomainException if the date is null, in the future, or older than the maximum allowed age
     */
    public DateOfBirth {
        validate(value);
    }

    /**
     * Validates the date of birth against null, future date, and maximum age constraints.
     *
     * @param value the date of birth to validate
     * @throws DomainException if validation fails
     */
    @Override
    public void validate(LocalDate value) {
        if (value == null) throw new DomainException(REQUIRED);

        final LocalDate currentDate = LocalDate.now();
        final LocalDate maxAllowedDate = currentDate.minusYears(MAX_AGE_YEARS);

        if (value.isAfter(currentDate)) throw new DomainException(FUTURE_DATE_MESSAGE);

        if (value.isBefore(maxAllowedDate)) throw new DomainException(String.format(TOO_OLD_MESSAGE, MAX_AGE_YEARS));
    }
}
