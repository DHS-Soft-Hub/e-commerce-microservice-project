package ecommerce.userprofile.profile.domain.valueobjects;

import ecommerce.userprofile.shared.domain.valueobject.ValueObject;
import ecommerce.userprofile.shared.exceptions.DomainException;
import ecommerce.userprofile.shared.services.FileValidationService;
import ecommerce.userprofile.shared.types.AllowedFileType;
import ecommerce.userprofile.shared.types.FileValidationConfig;

import java.io.File;

/**
 * Value object for user avatar images with file validation.
 * Supports JPEG, PNG, WEBP, HEIC formats up to 5MB.
 */
public record Avatar(File value) implements ValueObject<File> {

    /**
     * Maximum allowed file size in megabytes
     */
    public static final int MAX_SIZE_MB = 5;

    /**
     * Supported image file formats for avatars
     */
    public static final AllowedFileType[] ALLOWED_FILE_TYPES = {AllowedFileType.JPEG, AllowedFileType.PNG, AllowedFileType.WEBP, AllowedFileType.HEIC};

    /**
     * Error message for invalid avatar files
     */
    public static final String INVALID_FILE_MESSAGE = "Invalid avatar file";

    /**
     * Creates a validated avatar from the provided file.
     *
     * @throws DomainException if a file doesn't meet validation criteria
     */
    public Avatar {
        validate(value);
    }

    /**
     * Validates the avatar file against size and format requirements.
     *
     * @param value the file to validate
     * @throws DomainException if validation fails
     */
    @Override
    public void validate(File value) {
        FileValidationConfig config = getConfig();

        if (!FileValidationService.validateFile(value, config)) throw new DomainException(INVALID_FILE_MESSAGE);
    }

    /**
     * Creates file validation configuration for avatar files.
     *
     * @return configured validation rules for avatar files
     */
    private FileValidationConfig getConfig() {
        return FileValidationConfig.builder()
                .allow(ALLOWED_FILE_TYPES)
                .fileSize().inMB().max(MAX_SIZE_MB)
                .rejectEmptyFiles()
                .strictMimeValidation()
                .build();
    }
}