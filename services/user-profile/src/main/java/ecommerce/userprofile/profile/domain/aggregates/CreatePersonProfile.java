package ecommerce.userprofile.profile.domain.aggregates;

import ecommerce.userprofile.profile.domain.entities.Profile;
import ecommerce.userprofile.profile.domain.events.ProfileCreationCompletedEvent;
import ecommerce.userprofile.profile.domain.events.ProfileCreationFailedEvent;
import ecommerce.userprofile.profile.domain.events.ProfileCreationInitiatedEvent;
import ecommerce.userprofile.profile.domain.factories.PhoneNumberSpecificationFactory;
import ecommerce.userprofile.profile.domain.specifications.PhoneNumberSpecification;
import ecommerce.userprofile.profile.domain.specifications.ProfileCreationSpecification;
import ecommerce.userprofile.profile.domain.specifications.UniqueUsernameSpecification;
import ecommerce.userprofile.profile.domain.types.ProfileCreationStatus;
import ecommerce.userprofile.profile.domain.valueobjects.*;
import ecommerce.userprofile.shared.domain.aggregate.AggregateRoot;
import ecommerce.userprofile.shared.domain.valueobject.AggregateId;
import ecommerce.userprofile.shared.domain.valueobject.UserId;
import ecommerce.userprofile.shared.exceptions.DomainException;
import ecommerce.userprofile.shared.types.IsoCountry;
import lombok.*;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.time.Instant;
import java.util.Objects;
import java.util.Optional;

/**
 * Aggregate responsible for managing the profile creation process.
 * Handles validation, business rules, and domain events during profile creation.
 *
 * @version 1.0
 */
@Getter
@EqualsAndHashCode(callSuper = true)
public class CreatePersonProfile extends AggregateRoot<AggregateId> {

    public static final String USER_ID_REQUIRED_MESSAGE = "User ID cannot be null";
    public static final String FIRST_NAME_REQUIRED_MESSAGE = "First name cannot be null";
    public static final String LAST_NAME_REQUIRED_MESSAGE = "Last name cannot be null";
    public static final String PHONE_NUMBER_REQUIRED_MESSAGE = "Phone number cannot be null";
    public static final String COUNTRY_REQUIRED_MESSAGE = "Country cannot be null";
    public static final String PROFILE_ALREADY_CREATED_MESSAGE = "Profile has already been created";
    public static final String PROFILE_CREATION_FAILED_MESSAGE = "Profile creation has failed and cannot be retried";

    @NotNull
    @NonNull
    private final UserId userId;

    @NotNull
    @NonNull
    private ProfileCreationStatus status;

    @Nullable
    private Profile createdProfile;

    @Nullable
    private String failureReason;

    @NotNull
    @NonNull
    private NameField firstName;

    @NotNull
    @NonNull
    private NameField lastName;

    @NotNull
    @NonNull
    private String rawPhoneNumber;

    @NotNull
    @NonNull
    private IsoCountry phoneNumberCountry;

    @Nullable
    private NameField middleName;

    @Nullable
    private Username username;

    @Nullable
    private Avatar avatar;

    @Nullable
    private DateOfBirth dateOfBirth;

    @Nullable
    private Gender gender;

    private final PhoneNumberSpecificationFactory phoneNumberSpecificationFactory;

    /**
     * Private constructor for aggregate reconstitution from persistence.
     */
    @Builder(access = AccessLevel.PRIVATE)
    private CreatePersonProfile(
            @NotNull AggregateId id,
            @NotNull Long version,
            @NotNull Instant createdAt,
            @NotNull Instant updatedAt,
            @NotNull UserId userId,
            @NotNull ProfileCreationStatus status,
            @Nullable Profile createdProfile,
            @Nullable String failureReason,
            @NotNull NameField firstName,
            @NotNull NameField lastName,
            @NotNull String rawPhoneNumber,
            @NotNull IsoCountry phoneNumberCountry,
            @Nullable NameField middleName,
            @Nullable Username username,
            @Nullable Avatar avatar,
            @Nullable DateOfBirth dateOfBirth,
            @Nullable Gender gender,
            @NotNull PhoneNumberSpecificationFactory phoneNumberSpecificationFactory
    ) {
        super(id, version, createdAt, updatedAt);
        this.userId = userId;
        this.status = status;
        this.createdProfile = createdProfile;
        this.failureReason = failureReason;
        this.firstName = firstName;
        this.lastName = lastName;
        this.rawPhoneNumber = rawPhoneNumber;
        this.phoneNumberCountry = phoneNumberCountry;
        this.middleName = middleName;
        this.username = username;
        this.avatar = avatar;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.phoneNumberSpecificationFactory = phoneNumberSpecificationFactory;
    }

    /**
     * Initiates a new profile creation process.
     *
     * @param userId                          The user for whom the profile is being created
     * @param firstName                       User's first name (required)
     * @param lastName                        User's last name (required)
     * @param rawPhoneNumber                  User's phone number as raw string (required)
     * @param phoneNumberCountry              Country for phone number validation (required)
     * @param phoneNumberSpecificationFactory Factory for phone number validation
     * @return New CreatePersonProfile aggregate in INITIATED status
     * @throws IllegalArgumentException if any required field is null
     */
    @Contract("_, _, _, _, _, _ -> new")
    public static @NotNull CreatePersonProfile initiate(
            @NotNull UserId userId,
            @NotNull NameField firstName,
            @NotNull NameField lastName,
            @NotNull String rawPhoneNumber,
            @NotNull IsoCountry phoneNumberCountry,
            @NotNull PhoneNumberSpecificationFactory phoneNumberSpecificationFactory
    ) {
        Objects.requireNonNull(userId, USER_ID_REQUIRED_MESSAGE);
        Objects.requireNonNull(firstName, FIRST_NAME_REQUIRED_MESSAGE);
        Objects.requireNonNull(lastName, LAST_NAME_REQUIRED_MESSAGE);
        Objects.requireNonNull(rawPhoneNumber, PHONE_NUMBER_REQUIRED_MESSAGE);
        Objects.requireNonNull(phoneNumberCountry, COUNTRY_REQUIRED_MESSAGE);

        AggregateId aggregateId = AggregateId.generate();
        Instant now = Instant.now();

        CreatePersonProfile aggregate = CreatePersonProfile.builder()
                .id(aggregateId)
                .version(1L)
                .createdAt(now)
                .updatedAt(now)
                .userId(userId)
                .status(ProfileCreationStatus.INITIATED)
                .firstName(firstName)
                .lastName(lastName)
                .rawPhoneNumber(rawPhoneNumber)
                .phoneNumberCountry(phoneNumberCountry)
                .phoneNumberSpecificationFactory(phoneNumberSpecificationFactory)
                .build();

        aggregate.addDomainEvent(new ProfileCreationInitiatedEvent(
                aggregateId,
                aggregate.getVersion(),
                userId,
                firstName,
                lastName,
                rawPhoneNumber
        ));

        return aggregate;
    }

    /**
     * Reconstitutes aggregate from persistence.
     */
    public static @NotNull CreatePersonProfile fromPersistence(
            @NotNull AggregateId id,
            @NotNull Long version,
            @NotNull Instant createdAt,
            @NotNull Instant updatedAt,
            @NotNull UserId userId,
            @NotNull ProfileCreationStatus status,
            @Nullable Profile createdProfile,
            @Nullable String failureReason,
            @NotNull NameField firstName,
            @NotNull NameField lastName,
            @NotNull String rawPhoneNumber,
            @NotNull IsoCountry phoneNumberCountry,
            @Nullable NameField middleName,
            @Nullable Username username,
            @Nullable Avatar avatar,
            @Nullable DateOfBirth dateOfBirth,
            @Nullable Gender gender,
            @NotNull PhoneNumberSpecificationFactory phoneNumberSpecificationFactory
    ) {
        return CreatePersonProfile.builder()
                .id(id)
                .version(version)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .userId(userId)
                .status(status)
                .createdProfile(createdProfile)
                .failureReason(failureReason)
                .firstName(firstName)
                .lastName(lastName)
                .rawPhoneNumber(rawPhoneNumber)
                .phoneNumberCountry(phoneNumberCountry)
                .middleName(middleName)
                .username(username)
                .avatar(avatar)
                .dateOfBirth(dateOfBirth)
                .gender(gender)
                .phoneNumberSpecificationFactory(phoneNumberSpecificationFactory)
                .build();
    }

    /**
     * Gets the created profile if creation was successful.
     *
     * @return Optional containing the created profile
     */
    public Optional<Profile> getCreatedProfile() {
        return Optional.ofNullable(createdProfile);
    }

    /**
     * Gets the failure reason if creation failed.
     *
     * @return Optional containing the failure reason
     */
    public Optional<String> getFailureReason() {
        return Optional.ofNullable(failureReason);
    }

    /**
     * Checks if the profile creation process is complete and successful.
     *
     * @return true if the profile was created successfully
     */
    public boolean isProfileCreated() {
        return status == ProfileCreationStatus.COMPLETED && createdProfile != null;
    }

    /**
     * Checks if the profile creation process has failed.
     *
     * @return true if profile creation failed
     */
    public boolean isCreationFailed() {
        return status == ProfileCreationStatus.FAILED;
    }

    /**
     * Sets an optional middle name for the profile being created.
     *
     * @param middleName Middle name to set (can be null)
     * @throws DomainException if profile creation is not in progress
     */
    public void setMiddleName(@Nullable NameField middleName) {
        ensureProfileCreationInProgress();
        this.middleName = middleName;
        markAsChanged();
    }

    /**
     * Sets an optional username for the profile being created.
     *
     * @param username Username to set (can be null)
     * @throws DomainException if profile creation is not in progress
     */
    public void setUsername(@Nullable Username username) {
        ensureProfileCreationInProgress();
        this.username = username;
        markAsChanged();
    }

    /**
     * Sets an optional avatar for the profile being created.
     *
     * @param avatar Avatar to set (can be null)
     * @throws DomainException if profile creation is not in progress
     */
    public void setAvatar(@Nullable Avatar avatar) {
        ensureProfileCreationInProgress();
        this.avatar = avatar;
        markAsChanged();
    }

    /**
     * Sets an optional date of birth for the profile being created.
     *
     * @param dateOfBirth Date of birth to set (can be null)
     * @throws DomainException if profile creation is not in progress
     */
    public void setDateOfBirth(@Nullable DateOfBirth dateOfBirth) {
        ensureProfileCreationInProgress();
        this.dateOfBirth = dateOfBirth;
        markAsChanged();
    }

    /**
     * Sets optional gender for the profile being created.
     *
     * @param gender Gender to set (can be null)
     * @throws DomainException if profile creation is not in progress
     */
    public void setGender(@Nullable Gender gender) {
        ensureProfileCreationInProgress();
        this.gender = gender;
        markAsChanged();
    }

    /**
     * Attempts to create the profile with all provided information.
     * Validates all business rules before creating the profile.
     *
     * @param uniqueUsernameSpecification Specification to check username uniqueness
     * @throws DomainException if business rules are violated or creation fails
     */
    public void createProfile(@NotNull UniqueUsernameSpecification uniqueUsernameSpecification) {
        ensureProfileCreationInProgress();

        try {
            validateBusinessRules(uniqueUsernameSpecification);

            PhoneNumberSpecification phoneSpec = phoneNumberSpecificationFactory.getSpecification(phoneNumberCountry);
            PhoneNumber validatedPhoneNumber = PhoneNumber.create(rawPhoneNumber, phoneSpec);

            Profile profile = Profile.create(
                    userId,
                    firstName,
                    middleName,
                    lastName,
                    username,
                    validatedPhoneNumber,
                    avatar,
                    dateOfBirth,
                    gender
            );

            this.createdProfile = profile;
            this.status = ProfileCreationStatus.COMPLETED;
            markAsChanged();

            addDomainEvent(new ProfileCreationCompletedEvent(getId(), getVersion(), userId, profile.getId()));
        } catch (Exception e) {
            this.status = ProfileCreationStatus.FAILED;
            this.failureReason = e.getMessage();
            markAsChanged();

            addDomainEvent(new ProfileCreationFailedEvent(getId(), getVersion(), userId, e.getMessage()));

            throw new DomainException("Profile creation failed: " + e.getMessage());
        }
    }

    /**
     * Validates all business rules for profile creation.
     *
     * @param uniqueUsernameSpecification Specification to check username uniqueness
     * @throws DomainException if any business rule is violated
     */
    private void validateBusinessRules(@NotNull UniqueUsernameSpecification uniqueUsernameSpecification) {
        ProfileCreationSpecification creationSpec = new ProfileCreationSpecification(uniqueUsernameSpecification);
        if (!creationSpec.isSatisfiedBy(this))
            throw new DomainException("Profile creation violates business rules");

        PhoneNumberSpecification phoneSpec = phoneNumberSpecificationFactory.getSpecification(phoneNumberCountry);
        if (!phoneSpec.isSatisfiedBy(rawPhoneNumber))
            throw new DomainException("Invalid phone number for country: " + phoneNumberCountry.getName());
    }

    /**
     * Ensures that profile creation is still in progress and can be modified.
     *
     * @throws DomainException if profile creation is not in progress
     */
    private void ensureProfileCreationInProgress() {
        if (status == ProfileCreationStatus.COMPLETED) {
            throw new DomainException(PROFILE_ALREADY_CREATED_MESSAGE);
        }
        if (status == ProfileCreationStatus.FAILED) {
            throw new DomainException(PROFILE_CREATION_FAILED_MESSAGE);
        }
    }
}
