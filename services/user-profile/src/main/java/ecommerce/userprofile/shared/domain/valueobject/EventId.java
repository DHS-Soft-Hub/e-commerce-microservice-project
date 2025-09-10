package ecommerce.userprofile.shared.domain.valueobject;

import org.jetbrains.annotations.NotNull;

import java.util.UUID;

public record EventId() implements UUIDValueObject {
    public EventId {
        @NotNull UUID value = UUIDValueObject.generate();
    }
}
