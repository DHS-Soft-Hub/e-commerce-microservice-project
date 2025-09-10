package ecommerce.userprofile.shared.domain.valueobject;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.util.UUID;

public record AggregateId(UUID value) implements UUIDValueObject {
    public AggregateId {
        validate(value);
    }

    @Contract(" -> new")
    public static @NotNull AggregateId generate() {
        return new AggregateId(UUIDValueObject.generate());
    }
}
