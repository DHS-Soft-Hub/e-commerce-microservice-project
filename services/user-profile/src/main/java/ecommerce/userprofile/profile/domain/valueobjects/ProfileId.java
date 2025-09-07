package ecommerce.userprofile.profile.domain.valueobjects;

import ecommerce.userprofile.shared.base.UUIDValueObject;
import ecommerce.userprofile.shared.exceptions.DomainException;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.util.UUID;

/**
 * Value object for profile unique identifier.
 * UUID-based identifier with validation and factory methods.
 */
public record ProfileId(UUID value) implements UUIDValueObject {

    /**
     * Creates a validated profile ID.
     *
     * @throws DomainException if UUID is invalid
     */
    public ProfileId {
        validate(value);
    }

    /**
     * Generates a new random profile ID.
     *
     * @return new ProfileId with generated UUID
     */
    @Contract(" -> new")
    static @NotNull ProfileId generateId() {
        return new ProfileId(UUIDValueObject.generate());
    }

    /**
     * Creates ProfileId from string representation.
     *
     * @param uuid the UUID string to parse
     * @return ProfileId created from the UUID string
     * @throws DomainException if string is not a valid UUID
     */
    @Contract("_ -> new")
    static @NotNull ProfileId fromString(@NotNull String uuid) {
        return new ProfileId(UUIDValueObject.fromString(uuid));
    }
}