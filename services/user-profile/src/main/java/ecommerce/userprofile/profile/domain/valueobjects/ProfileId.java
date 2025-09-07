package ecommerce.userprofile.profile.domain.valueobjects;

import ecommerce.userprofile.shared.base.UUIDValueObject;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.util.UUID;

public record ProfileId(UUID value) implements UUIDValueObject {
    public ProfileId {
        validate(value);
    }

    @Contract(" -> new")
    static @NotNull ProfileId generateId() {
        return new ProfileId(UUIDValueObject.generate());
    }

    @Contract("_ -> new")
    static @NotNull ProfileId fromString(@NotNull String uuid) {
        return new ProfileId(UUIDValueObject.fromString(uuid));
    }
}