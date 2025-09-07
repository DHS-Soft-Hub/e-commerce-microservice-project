package ecommerce.userprofile.profile.domain.valueobjects;

import ecommerce.userprofile.shared.domain.ValueObject;
import ecommerce.userprofile.shared.exceptions.DomainException;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;


public record NameField(String value) implements ValueObject<String> {
    public static final int MIN_LENGTH = 2;
    public static final int MAX_LENGTH = 100;

    public static final String REQUIRED_MESSAGE = "Name cannot be null";
    public static final String MIN_LENGTH_MESSAGE = "Name cannot be shorter than %d characters";
    public static final String MAX_LENGTH_MESSAGE = "Name cannot be longer than %d characters";
    public static final String INVALID_CHARACTERS_MESSAGE = "Name contains invalid characters";

    public static final String CHARACTER_PATTERN = "^[\\p{L}\\s'-]+$";

    public NameField {
        String normalizedValue = normalize(value);

        validate(normalizedValue);

        value = capitalizeFirstLetter(normalizedValue);
    }

    private static @NotNull String capitalizeFirstLetter(@NotNull String name) {
        if (name.length() == 1) {
            return name.toUpperCase();
        } else
            return name.substring(0, 1).toUpperCase() + name.substring(1);
    }

    private static String normalize(String input) {
        return input == null ? null : input.trim();
    }

    public void validate(String value) {
        if (value == null || value.isBlank()) throw new DomainException(REQUIRED_MESSAGE);
        if (value.length() < MIN_LENGTH) throw new DomainException(String.format(MIN_LENGTH_MESSAGE, MIN_LENGTH));
        if (value.length() > MAX_LENGTH) throw new DomainException(String.format(MAX_LENGTH_MESSAGE, MAX_LENGTH));
        if (!isValidCharacters(value)) throw new DomainException(INVALID_CHARACTERS_MESSAGE);
    }

    @Contract(pure = true)
    private static boolean isValidCharacters(@NotNull String value) {
        return value.matches(CHARACTER_PATTERN);
    }
}