package ecommerce.userprofile.shared.domain.valueobject;

import java.util.UUID;

public record UserId(UUID value) implements UUIDValueObject {
    public UserId {
        validate(value);
    }
}
