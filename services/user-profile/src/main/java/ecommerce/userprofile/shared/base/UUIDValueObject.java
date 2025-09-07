package ecommerce.userprofile.shared.base;

import ecommerce.userprofile.shared.exceptions.DomainException;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.util.UUID;

public interface UUIDValueObject extends ValueObject<UUID> {
    String REQUIRED_MESSAGE = "Value cannot be null";
    String VERSION_MESSAGE = "Invalid UUID version";

    default void validate(UUID value) {
        if (value == null) throw new DomainException(REQUIRED_MESSAGE);

        if (value.version() != 4) throw new DomainException(VERSION_MESSAGE);
    }

    @Contract(" -> new")
    static @NotNull UUID generate() {
        return UUID.randomUUID();
    }

    static @NotNull UUID fromString(@NotNull String uuid) {
        return UUID.fromString(uuid);
    }
}