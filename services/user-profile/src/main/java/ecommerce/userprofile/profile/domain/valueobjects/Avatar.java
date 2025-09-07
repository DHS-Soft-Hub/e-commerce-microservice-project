package ecommerce.userprofile.profile.domain.valueobjects;

import ecommerce.userprofile.shared.base.ValueObject;
import ecommerce.userprofile.shared.exceptions.DomainException;
import ecommerce.userprofile.shared.services.FileValidationService;
import ecommerce.userprofile.shared.types.AllowedFileType;
import ecommerce.userprofile.shared.types.FileValidationConfig;

import java.io.File;

public record Avatar(File value) implements ValueObject<File> {

    public static final int MAX_SIZE_MB = 5;
    public static final AllowedFileType[] ALLOWED_FILE_TYPES = {AllowedFileType.JPEG, AllowedFileType.PNG, AllowedFileType.WEBP, AllowedFileType.HEIC};

    public static final String INVALID_FILE_MESSAGE = "Invalid avatar file";

    public Avatar {
        validate(value);
    }

    @Override
    public void validate(File value) {
        FileValidationConfig config = getConfig();

        if (!FileValidationService.validateFile(value, config)) throw new DomainException(INVALID_FILE_MESSAGE);
    }

    private FileValidationConfig getConfig() {
        return FileValidationConfig.builder()
                .allow(ALLOWED_FILE_TYPES)
                .fileSize().inMB().max(MAX_SIZE_MB)
                .rejectEmptyFiles()
                .strictMimeValidation()
                .build();
    }
}