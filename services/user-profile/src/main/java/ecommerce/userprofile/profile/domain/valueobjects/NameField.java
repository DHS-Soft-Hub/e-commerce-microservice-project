package ecommerce.userprofile.profile.domain.valueobjects;

import ecommerce.userprofile.shared.base.ValueObject;
import ecommerce.userprofile.shared.exceptions.DomainException;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

/**
 * Value object for person names with validation and normalization.
 * Accepts letters, spaces, apostrophes and hyphens. Auto-capitalizes the first letter.
 */
public record NameField(String value) implements ValueObject<String> {

    /**
     * Minimum allowed name length
     */
    public static final int MIN_LENGTH = 2;

    /**
     * Maximum allowed name length
     */
    public static final int MAX_LENGTH = 100;

    /**
     * Error message for null/blank names
     */
    public static final String REQUIRED_MESSAGE = "Name cannot be null";

    /**
     * Error message for names too short
     */
    public static final String MIN_LENGTH_MESSAGE = "Name cannot be shorter than %d characters";

    /**
     * Error message for names too long
     */
    public static final String MAX_LENGTH_MESSAGE = "Name cannot be longer than %d characters";

    /**
     * Error message for invalid characters
     */
    public static final String INVALID_CHARACTERS_MESSAGE = "Name contains invalid characters";

    /**
     * Regex pattern for valid name characters (letters, spaces, apostrophes, hyphens)
     */
    public static final String CHARACTER_PATTERN = "^[\\p{L}\\s'-]+$";

    /**
     * Creates a normalized and validated name field.
     * Trims whitespace and capitalizes the first letter.
     */
    public NameField {
        String normalizedValue = normalize(value);

        validate(normalizedValue);

        value = capitalizeFirstLetter(normalizedValue);
    }

    /**
     * Capitalizes the first letter of the name.
     *
     * @param name the name to capitalize
     * @return name with the first letter capitalized
     */
    private static @NotNull String capitalizeFirstLetter(@NotNull String name) {
        if (name.length() == 1) {
            return name.toUpperCase();
        } else
            return name.substring(0, 1).toUpperCase() + name.substring(1);
    }

    /**
     * Normalizes input by trimming whitespace.
     *
     * @param input the input to normalize
     * @return trimmed input or null if input was null
     */
    private static String normalize(String input) {
        return input == null ? null : input.trim();
    }

    /**
     * Validates name against business rules.
     *
     * @param value the name to validate
     * @throws DomainException if validation fails
     */
    public void validate(String value) {
        if (value == null || value.isBlank()) throw new DomainException(REQUIRED_MESSAGE);
        if (value.length() < MIN_LENGTH) throw new DomainException(String.format(MIN_LENGTH_MESSAGE, MIN_LENGTH));
        if (value.length() > MAX_LENGTH) throw new DomainException(String.format(MAX_LENGTH_MESSAGE, MAX_LENGTH));
        if (!isValidCharacters(value)) throw new DomainException(INVALID_CHARACTERS_MESSAGE);
    }

    /**
     * Checks if the name contains only valid characters.
     *
     * @param value the name to check
     * @return true if all characters are valid
     */
    @Contract(pure = true)
    private static boolean isValidCharacters(@NotNull String value) {
        return value.matches(CHARACTER_PATTERN);
    }
}