package ecommerce.userprofile.profile.domain.valueobjects;

import ecommerce.userprofile.shared.base.ValueObject;
import ecommerce.userprofile.shared.exceptions.DomainException;

/**
 * Value object representing a username with length and character validation.
 * Ensures username contains only letters, digits, and underscores with length between 3-20 characters.
 */
public record Username(String value) implements ValueObject<String> {

    /**
     * Minimum allowed username length
     */
    public static final int MIN_LENGTH = 3;

    /**
     * Maximum allowed username length
     */
    public static final int MAX_LENGTH = 20;

    /**
     * Regular expression pattern for allowed username characters (letters, digits, underscore)
     */
    public static final String VALID_PATTERN = "^[a-zA-Z0-9_]{" + MIN_LENGTH + "," + MAX_LENGTH + "}$";

    /**
     * Error message for null username values
     */
    public static final String REQUIRED = "Username is required";

    /**
     * Error message for invalid username length
     */
    public static final String INVALID_LENGTH_MESSAGE = "Username must be between " + MIN_LENGTH + " and " + MAX_LENGTH + " characters";

    /**
     * Error message for invalid username characters
     */
    public static final String INVALID_CHARACTERS_MESSAGE = "Username can only contain letters, digits, and underscores";

    /**
     * Creates a validated username from the provided string.
     *
     * @throws DomainException if the username is null, has an invalid length, or contains invalid characters
     */
    public Username {
        validate(value);
    }

    /**
     * Validates the username against null, length, and character constraints.
     *
     * @param value the username to validate
     * @throws DomainException if validation fails
     */
    @Override
    public void validate(String value) {
        if (value == null) throw new DomainException(REQUIRED);

        final int length = value.length();

        if (length < MIN_LENGTH || length > MAX_LENGTH) throw new DomainException(INVALID_LENGTH_MESSAGE);

        if (!value.matches(VALID_PATTERN)) throw new DomainException(INVALID_CHARACTERS_MESSAGE);
    }
}
