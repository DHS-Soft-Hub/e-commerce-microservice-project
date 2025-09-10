package ecommerce.userprofile.profile.domain.entities;

import ecommerce.userprofile.profile.domain.types.ProfileFieldType;
import ecommerce.userprofile.profile.domain.valueobjects.*;
import ecommerce.userprofile.shared.domain.entities.DomainEntity;
import ecommerce.userprofile.shared.exceptions.DomainException;
import lombok.*;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;


/**
 * Profile domain entity representing a user's profile information.
 *
 * @author Daniel Terziev
 * @version 1.0
 */
@Getter
@Builder(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Profile extends DomainEntity<ProfileId> {

    public static final String PROFILE_ID_REQUIRED_MESSAGE = "Profile ID cannot be null";
    public static final String FIRST_NAME_REQUIRED_MESSAGE = "First name cannot be null";
    public static final String LAST_NAME_REQUIRED_MESSAGE = "Last name cannot be null";
    public static final String PHONE_NUMBER_REQUIRED_MESSAGE = "Phone number cannot be null";
    public static final String VERSION_REQUIRED_MESSAGE = "Version cannot be null";
    public static final String UPDATED_AT_REQUIRED_MESSAGE = "Updated at cannot be null";

    public static final int USERNAME_CHANGE_COOLDOWN_DAYS = 30;
    public static final String USERNAME_CHANGE_COOLDOWN_MESSAGE = "Username can only be changed once every %d days";

    @NotNull
    @NonNull
    private ProfileId id;

    @NotNull
    @NonNull
    private NameField firstName;

    @NotNull
    @NonNull
    private NameField lastName;

    @NotNull
    @NonNull
    private PhoneNumber phoneNumber;

    @NotNull
    @NonNull
    private Long version;

    @NotNull
    @NonNull
    private LocalDateTime updatedAt;

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

    /**
     * Creates a new profile with the provided information.
     *
     * @param firstName   User's first name (required)
     * @param middleName  User's middle name (optional)
     * @param lastName    User's last name (required)
     * @param username    User's username (optional)
     * @param phoneNumber User's phone number (required)
     * @param avatar      User's avatar (optional)
     * @param dateOfBirth User's date of birth (optional)
     * @param gender      User's gender (optional)
     * @return New Profile instance with generated ID and initial metadata
     * @throws IllegalArgumentException if any required field is null
     */
    @Contract(value = "_, _, _, _, _, _, _, _ -> new")
    public static @NotNull Profile create(
            @NotNull NameField firstName,
            @Nullable NameField middleName,
            @NotNull NameField lastName,
            @Nullable Username username,
            @NotNull PhoneNumber phoneNumber,
            @Nullable Avatar avatar,
            @Nullable DateOfBirth dateOfBirth,
            @Nullable Gender gender
    ) {
        Objects.requireNonNull(firstName, FIRST_NAME_REQUIRED_MESSAGE);
        Objects.requireNonNull(lastName, LAST_NAME_REQUIRED_MESSAGE);
        Objects.requireNonNull(phoneNumber, PHONE_NUMBER_REQUIRED_MESSAGE);

        return Profile.builder()
                .id(ProfileId.generateId())
                .firstName(firstName)
                .middleName(middleName)
                .lastName(lastName)
                .username(username)
                .phoneNumber(phoneNumber)
                .avatar(avatar)
                .dateOfBirth(dateOfBirth)
                .gender(gender)
                .version(0L)
                .updatedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Reconstitutes a profile from persistence layer data.
     * <p>
     * This factory method is used when loading profiles from the database
     * and preserves all existing metadata, including a version and timestamps.
     *
     * @param id          Existing profile ID
     * @param firstName   User's first name
     * @param middleName  User's middle name (optional)
     * @param lastName    User's last name
     * @param username    User's username (optional)
     * @param phoneNumber User's phone number
     * @param avatar      User's avatar (optional)
     * @param dateOfBirth User's date of birth (optional)
     * @param gender      User's gender (optional)
     * @param version     Current version for concurrency control
     * @param updatedAt   Last update timestamp
     * @return Profile instance with existing data
     * @throws IllegalArgumentException if any required field is null
     */
    @Contract(value = "_, _, _, _, _, _, _, _, _, _, _ -> new")
    public static @NotNull Profile fromPersistence(
            @NotNull ProfileId id,
            @NotNull NameField firstName,
            @Nullable NameField middleName,
            @NotNull NameField lastName,
            @Nullable Username username,
            @NotNull PhoneNumber phoneNumber,
            @Nullable Avatar avatar,
            @Nullable DateOfBirth dateOfBirth,
            @Nullable Gender gender,
            @NotNull Long version,
            @NotNull LocalDateTime updatedAt
    ) {
        Objects.requireNonNull(id, PROFILE_ID_REQUIRED_MESSAGE);
        Objects.requireNonNull(firstName, FIRST_NAME_REQUIRED_MESSAGE);
        Objects.requireNonNull(lastName, LAST_NAME_REQUIRED_MESSAGE);
        Objects.requireNonNull(phoneNumber, PHONE_NUMBER_REQUIRED_MESSAGE);
        Objects.requireNonNull(version, VERSION_REQUIRED_MESSAGE);
        Objects.requireNonNull(updatedAt, UPDATED_AT_REQUIRED_MESSAGE);

        return Profile.builder()
                .id(id)
                .firstName(firstName)
                .middleName(middleName)
                .lastName(lastName)
                .username(username)
                .phoneNumber(phoneNumber)
                .avatar(avatar)
                .dateOfBirth(dateOfBirth)
                .gender(gender)
                .version(version)
                .updatedAt(updatedAt)
                .build();
    }

    /**
     * Gets the user's middle name wrapped in an Optional.
     *
     * @return Optional containing middle name if present, empty otherwise
     */
    public Optional<NameField> getMiddleName() {
        return Optional.ofNullable(middleName);
    }

    /**
     * Gets the user's username wrapped in an Optional.
     *
     * @return Optional containing username if present, empty otherwise
     */
    public Optional<Username> getUsername() {
        return Optional.ofNullable(username);
    }

    /**
     * Gets the user's avatar wrapped in an Optional.
     *
     * @return Optional containing avatar if present, empty otherwise
     */
    public Optional<Avatar> getAvatar() {
        return Optional.ofNullable(avatar);
    }

    /**
     * Gets the user's date of birth wrapped in an Optional.
     *
     * @return Optional containing date of birth if present, empty otherwise
     */
    public Optional<DateOfBirth> getDateOfBirth() {
        return Optional.ofNullable(dateOfBirth);
    }

    /**
     * Gets the user's gender wrapped in an Optional.
     *
     * @return Optional containing gender if present, empty otherwise
     */
    public Optional<Gender> getGender() {
        return Optional.ofNullable(gender);
    }

    /**
     * Updates the user's first name following business rules.
     * <p>
     * Generates a ProfileChangeEvent if the value actually changes.
     * Updates version and timestamp upon successful change.
     *
     * @param newFirstName New first name value
     * @throws IllegalArgumentException if the newFirstName is null
     * @throws DomainException          if business rules are violated
     */
    public void updateFirstName(@NotNull NameField newFirstName) {
        Objects.requireNonNull(newFirstName, FIRST_NAME_REQUIRED_MESSAGE);

        updateField(
                ProfileFieldType.FIRST_NAME,
                newFirstName,
                () -> this.firstName,
                value -> this.firstName = value,
                null
        );
    }

    /**
     * Updates the user's middle name following business rules.
     * <p>
     * Allows setting to null to remove the middle name.
     * Generates a ProfileChangeEvent if the value actually changes.
     *
     * @param newMiddleName New middle name value (can be null)
     * @throws DomainException if business rules are violated
     */
    public void updateMiddleName(@Nullable NameField newMiddleName) {
        updateField(
                ProfileFieldType.MIDDLE_NAME,
                newMiddleName,
                () -> this.middleName,
                value -> this.middleName = value,
                null
        );
    }

    /**
     * Updates the user's last name following business rules.
     * <p>
     * Generates a ProfileChangeEvent if the value actually changes.
     * Updates version and timestamp upon successful change.
     *
     * @param newLastName New last name value
     * @throws IllegalArgumentException if the newLastName is null
     * @throws DomainException          if business rules are violated
     */
    public void updateLastName(@NotNull NameField newLastName) {
        updateField(
                ProfileFieldType.LAST_NAME,
                newLastName,
                () -> this.lastName,
                value -> this.lastName = value,
                null
        );
    }

    /**
     * Updates the user's phone number following business rules.
     * <p>
     * Generates a ProfileChangeEvent if the value actually changes.
     * Updates version and timestamp upon successful change.
     *
     * @param newPhoneNumber New phone number value
     * @throws IllegalArgumentException if the newPhoneNumber is null
     * @throws DomainException          if business rules are violated
     */
    public void updatePhoneNumber(@NotNull PhoneNumber newPhoneNumber) {
        Objects.requireNonNull(newPhoneNumber, PHONE_NUMBER_REQUIRED_MESSAGE);

        updateField(
                ProfileFieldType.PHONE_NUMBER,
                newPhoneNumber,
                () -> this.phoneNumber,
                value -> this.phoneNumber = value,
                null
        );
    }

    /**
     * Updates the user's username following business rules.
     * <p>
     * Enforces a username change cooldown period (30 days between changes).
     * Allows setting username for the first time without cooldown.
     * Generates a ProfileChangeEvent if the value actually changes.
     *
     * @param newUsername New username value
     * @throws DomainException if the username change cooldown is still active
     */
    public void updateUsername(@Nullable Username newUsername) {
        updateField(
                ProfileFieldType.USERNAME,
                newUsername,
                () -> this.username,
                value -> this.username = value,
                () -> canChangeUsername() ? null : String.format(USERNAME_CHANGE_COOLDOWN_MESSAGE, USERNAME_CHANGE_COOLDOWN_DAYS)
        );
    }

    /**
     * Updates the user's avatar following business rules.
     * <p>
     * Allows setting to null to remove avatar.
     * Generates a ProfileChangeEvent if the value actually changes.
     *
     * @param newAvatar New avatar value (can be null)
     * @throws DomainException if business rules are violated
     */
    public void updateAvatar(@Nullable Avatar newAvatar) {
        updateField(
                ProfileFieldType.AVATAR,
                newAvatar,
                () -> this.avatar,
                value -> this.avatar = value,
                null
        );
    }

    /**
     * Updates the user's date of birth following business rules.
     * <p>
     * Allows setting to null to remove date of birth.
     * Generates a ProfileChangeEvent if the value actually changes.
     *
     * @param newDateOfBirth New date of birth value (can be null)
     * @throws DomainException if business rules are violated
     */
    public void updateDateOfBirth(@Nullable DateOfBirth newDateOfBirth) {
        updateField(
                ProfileFieldType.DATE_OF_BIRTH,
                newDateOfBirth,
                () -> this.dateOfBirth,
                value -> this.dateOfBirth = value,
                null
        );
    }

    /**
     * Updates the user's gender following business rules.
     * <p>
     * Allows setting to null to remove gender.
     * Generates a ProfileChangeEvent if the value actually changes.
     *
     * @param newGender New gender value (can be null)
     * @throws DomainException if business rules are violated
     */
    public void updateGender(@Nullable Gender newGender) {
        updateField(
                ProfileFieldType.GENDER,
                newGender,
                () -> this.gender,
                value -> this.gender = value,
                null
        );
    }

    /**
     * Checks if the username can be changed based on business rules.
     *
     * @return true if username can be changed, false otherwise
     */
    private boolean canChangeUsername() {
        if (username == null) return true;

        return getUsernameChangeCooldown().isBefore(LocalDateTime.now());
    }

    /**
     * Generic field update method that handles the common pattern of:
     *
     * @param <T>                   Type of the field being updated
     * @param fieldType             Enum identifying which field is being updated
     * @param newValue              New value for the field
     * @param currentValueGetter    Function to get the current field value
     * @param valueSetter           Function to set a new field value
     * @param businessRuleValidator Optional function to validate business rules
     * @throws DomainException if business rules are violated
     */
    private <T> void updateField(
            @NotNull ProfileFieldType fieldType,
            @Nullable T newValue,
            @NotNull java.util.function.Supplier<T> currentValueGetter,
            @NotNull java.util.function.Consumer<T> valueSetter,
            @Nullable java.util.function.Supplier<String> businessRuleValidator
    ) {
        if (businessRuleValidator != null) {
            String error = businessRuleValidator.get();
            if (error != null) {
                throw new DomainException(error);
            }
        }

        T currentValue = currentValueGetter.get();
        if (Objects.equals(currentValue, newValue)) return;

        valueSetter.accept(newValue);
    }

    /**
     * Calculates when the username change cooldown expires.
     *
     * @return LocalDateTime when the next username change is allowed
     */
    private @NotNull LocalDateTime getUsernameChangeCooldown() {
        return this.updatedAt.plusDays(USERNAME_CHANGE_COOLDOWN_DAYS);
    }
}
