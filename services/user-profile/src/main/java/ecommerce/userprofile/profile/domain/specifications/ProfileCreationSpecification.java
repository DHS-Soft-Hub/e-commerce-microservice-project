package ecommerce.userprofile.profile.domain.specifications;

import ecommerce.userprofile.profile.domain.aggregates.CreatePersonProfile;
import ecommerce.userprofile.shared.domain.Specification;
import org.jetbrains.annotations.NotNull;

import java.util.Objects;

/**
 * Specification for validating profile creation business rules.
 */
public record ProfileCreationSpecification(UniqueUsernameSpecification uniqueUsernameSpecification)
        implements Specification<CreatePersonProfile> {

    public static final String AGGREGATE_REQUIRED_MESSAGE = "Aggregate cannot be null";

    public ProfileCreationSpecification(UniqueUsernameSpecification uniqueUsernameSpecification) {
        this.uniqueUsernameSpecification = uniqueUsernameSpecification;
    }

    @Override
    public boolean isSatisfiedBy(@NotNull CreatePersonProfile aggregate) {
        Objects.requireNonNull(aggregate, AGGREGATE_REQUIRED_MESSAGE);

        if (aggregate.getUsername() != null) {
            return uniqueUsernameSpecification.isSatisfiedBy(aggregate.getUsername().value());
        }

        return true;
    }
}
