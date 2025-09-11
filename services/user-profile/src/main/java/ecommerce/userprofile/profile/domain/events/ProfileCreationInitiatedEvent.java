package ecommerce.userprofile.profile.domain.events;

import ecommerce.userprofile.profile.domain.valueobjects.NameField;
import ecommerce.userprofile.shared.domain.DomainEvent;
import ecommerce.userprofile.shared.domain.valueobject.AggregateId;
import ecommerce.userprofile.shared.domain.valueobject.UserId;
import lombok.Getter;
import org.jetbrains.annotations.NotNull;

/**
 * Domain event raised when profile creation is initiated.
 *
 * @version 1.0
 */
@Getter
public final class ProfileCreationInitiatedEvent extends DomainEvent {

    private final UserId userId;
    private final NameField firstName;
    private final NameField lastName;
    private final String rawPhoneNumber;

    public ProfileCreationInitiatedEvent(
            @NotNull AggregateId aggregateId,
            @NotNull Long aggregateVersion,
            @NotNull UserId userId,
            @NotNull NameField firstName,
            @NotNull NameField lastName,
            @NotNull String rawPhoneNumber
    ) {
        super(aggregateId, aggregateVersion);
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.rawPhoneNumber = rawPhoneNumber;
    }
}
