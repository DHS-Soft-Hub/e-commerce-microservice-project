package ecommerce.userprofile.profile.domain.events;

import ecommerce.userprofile.profile.domain.valueobjects.ProfileId;

public interface ProfileDomainEvent {
    ProfileId getProfileId();
}
