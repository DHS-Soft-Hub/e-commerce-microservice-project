package ecommerce.userprofile.shared.base;

import ecommerce.userprofile.shared.exceptions.DomainException;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.util.UUID;

/**
 * Base interface for UUID-based value objects.
 * Enforces version 4 UUID validation and provides factory methods.
 */
public interface UUIDValueObject extends ValueObject<UUID> {

    /**
     * Error message for null UUID values
     */
    String REQUIRED_MESSAGE = "Value cannot be null";

    /**
     * Error message for invalid UUID version
     */
    String VERSION_MESSAGE = "Invalid UUID version";

    /**
     * Validates UUID is not null and is version 4 (random).
     *
     * @param value the UUID to validate
     * @throws DomainException if UUID is null or not, version 4
     */
    default void validate(UUID value) {
        if (value == null) throw new DomainException(REQUIRED_MESSAGE);

        if (value.version() != 4) throw new DomainException(VERSION_MESSAGE);
    }

    /**
     * Generates a new random UUID version 4.
     *
     * @return new random UUID
     */
    @Contract(" -> new")
    static @NotNull UUID generate() {
        return UUID.randomUUID();
    }

    /**
     * Parses UUID from string representation.
     *
     * @param uuid the UUID string to parse
     * @return parsed UUID
     * @throws IllegalArgumentException if string is not a valid UUID
     */
    static @NotNull UUID fromString(@NotNull String uuid) {
        return UUID.fromString(uuid);
    }
}