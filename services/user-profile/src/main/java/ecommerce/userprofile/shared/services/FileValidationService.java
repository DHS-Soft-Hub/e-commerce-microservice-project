package ecommerce.userprofile.shared.services;

import ecommerce.userprofile.shared.types.FileValidationConfig;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
public class FileValidationService {

    public static final String IO_EXCEPTION_MESSAGE = "IOException during file validation for: {}";
    public static final String UNEXPECTED_ERROR_MESSAGE = "Unexpected error during file validation for: {}";

    /**
     * Validates a file path against the provided configuration
     *
     * @param file   the file to validate
     * @param config the validation configuration
     * @return true if the file passes all validation rules, false otherwise
     */
    public static boolean validateFile(@NotNull File file, @NotNull FileValidationConfig config) {
        Path filePath = file.toPath();

        try {
            if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) return false;

            String fileName = filePath.getFileName().toString();
            String extension = extractFileExtension(fileName);
            long fileSize = Files.size(filePath);

            if (!isExtensionValid(extension, config)) return false;

            if (!config.isFileSizeValid(fileSize)) return false;

            return !config.strictMimeTypeValidation() || isMimeTypeValid(filePath, config);
        } catch (IOException e) {
            log.error(IO_EXCEPTION_MESSAGE, filePath, e);
            return false;
        } catch (Exception e) {
            log.error(UNEXPECTED_ERROR_MESSAGE, filePath, e);
            return false;
        }
    }

    /**
     * Extracts file extension from filename
     */
    private static @Nullable String extractFileExtension(@NotNull String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == fileName.length() - 1) {
            return null;
        }
        return fileName.substring(lastDotIndex + 1).toLowerCase();
    }

    /**
     * Validates file extension against the configuration
     */
    private static boolean isExtensionValid(@Nullable String extension, @NotNull FileValidationConfig config) {
        if (extension == null || extension.isEmpty()) {
            return false;
        }
        return config.isExtensionAllowed(extension);
    }

    /**
     * Validates MIME type against the configuration
     */
    private static boolean isMimeTypeValid(@NotNull Path filePath, @NotNull FileValidationConfig config) {
        try {
            String mimeType = Files.probeContentType(filePath);
            if (mimeType == null) return false;

            return config.isMimeTypeAllowed(mimeType);
        } catch (IOException e) {
            return false;
        }
    }
}
