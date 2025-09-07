package ecommerce.userprofile.shared.types;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Unmodifiable;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public record FileValidationConfig(@NotNull Set<AllowedFileType> allowedFileTypes, @NotNull Long maxFileSizeBytes,
                                   Long minFileSizeBytes, boolean strictMimeTypeValidation, boolean allowEmptyFiles) {

    /**
     * Creates a new builder for FileValidationConfig
     */
    @Contract(value = " -> new", pure = true)
    public static @NotNull FileValidationConfigBuilder builder() {
        return new FileValidationConfigBuilder();
    }

    /**
     * Validates if the given file type is allowed
     */
    public boolean isFileTypeAllowed(@NotNull AllowedFileType fileType) {
        return allowedFileTypes.contains(fileType);
    }

    /**
     * Validates if the given extension is allowed
     */
    public boolean isExtensionAllowed(@NotNull String extension) {
        return allowedFileTypes.stream()
                .anyMatch(type -> type.matchesExtension(extension));
    }

    /**
     * Validates if the given MIME type is allowed
     */
    public boolean isMimeTypeAllowed(@NotNull String mimeType) {
        return allowedFileTypes.stream()
                .anyMatch(type -> type.matchesMimeType(mimeType));
    }

    /**
     * Validates if the given file size is within limits
     */
    public boolean isFileSizeValid(long fileSizeBytes) {
        if (fileSizeBytes == 0) {
            return allowEmptyFiles;
        }

        if (minFileSizeBytes != null && fileSizeBytes < minFileSizeBytes) {
            return false;
        }

        return fileSizeBytes <= maxFileSizeBytes;
    }

    /**
     * Gets all allowed extensions
     */
    @Contract(value = " -> new", pure = true)
    public @NotNull @Unmodifiable Set<String> getAllowedExtensions() {
        return allowedFileTypes.stream()
                .flatMap(type -> type.getExtensions().stream())
                .collect(Collectors.toUnmodifiableSet());
    }

    /**
     * Gets all allowed MIME types
     */
    @Contract(value = " -> new", pure = true)
    public @NotNull @Unmodifiable Set<String> getAllowedMimeTypes() {
        return allowedFileTypes.stream()
                .map(AllowedFileType::getMimeType)
                .collect(Collectors.toUnmodifiableSet());
    }

    public static class FileValidationConfigBuilder {
        private Set<AllowedFileType> allowedFileTypes;
        private Long maxFileSizeBytes;
        private Long minFileSizeBytes;
        private boolean strictMimeTypeValidation = true;
        private boolean allowEmptyFiles = false;

        /**
         * Allow specific file types
         */
        public FileValidationConfigBuilder allow(AllowedFileType... fileTypes) {
            this.allowedFileTypes = Set.of(fileTypes);
            return this;
        }

        /**
         * Allow by category with fluent exception handling
         */
        public CategoryBuilder allowByCategory(@NotNull AllowedFileType.FileCategory category) {
            return new CategoryBuilder(this, category);
        }

        /**
         * Configure file size with a fluent unit setting
         */
        public FileSizeBuilder fileSize() {
            return new FileSizeBuilder(this);
        }

        /**
         * Allow empty files
         */
        public FileValidationConfigBuilder allowEmptyFiles() {
            this.allowEmptyFiles = true;
            this.minFileSizeBytes = 0L;
            return this;
        }

        /**
         * Reject empty files
         */
        public FileValidationConfigBuilder rejectEmptyFiles() {
            this.allowEmptyFiles = false;
            return this;
        }

        /**
         * Enable strict MIME type validation
         */
        public FileValidationConfigBuilder strictMimeValidation() {
            this.strictMimeTypeValidation = true;
            return this;
        }

        /**
         * Disable strict MIME type validation
         */
        public FileValidationConfigBuilder relaxedMimeValidation() {
            this.strictMimeTypeValidation = false;
            return this;
        }

        // Internal method for nested builders
        FileValidationConfigBuilder setAllowedFileTypes(Set<AllowedFileType> fileTypes) {
            this.allowedFileTypes = fileTypes;
            return this;
        }

        FileValidationConfigBuilder setMaxSize(long bytes) {
            this.maxFileSizeBytes = bytes;
            return this;
        }

        FileValidationConfigBuilder setMinSize(long bytes) {
            this.minFileSizeBytes = bytes;
            return this;
        }

        public FileValidationConfig build() {
            if (allowedFileTypes == null || allowedFileTypes.isEmpty()) {
                throw new IllegalStateException("At least one file type must be allowed");
            }

            if (maxFileSizeBytes == null || maxFileSizeBytes <= 0) {
                throw new IllegalStateException("Maximum file size must be positive");
            }

            if (minFileSizeBytes != null && minFileSizeBytes < 0) {
                throw new IllegalStateException("Minimum file size cannot be negative");
            }

            if (minFileSizeBytes != null && minFileSizeBytes > maxFileSizeBytes) {
                throw new IllegalStateException("Minimum file size cannot be greater than maximum file size");
            }

            if (!allowEmptyFiles && minFileSizeBytes != null && minFileSizeBytes == 0) {
                throw new IllegalStateException("Cannot reject empty files while setting minimum size to 0 bytes");
            }

            if (allowEmptyFiles && minFileSizeBytes != null && minFileSizeBytes > 0) {
                throw new IllegalStateException("Cannot allow empty files while setting minimum size to " + minFileSizeBytes + " bytes");
            }

            return new FileValidationConfig(allowedFileTypes, maxFileSizeBytes, minFileSizeBytes,
                    strictMimeTypeValidation, allowEmptyFiles);
        }
    }

    public static class CategoryBuilder {
        private final FileValidationConfigBuilder parent;
        private final AllowedFileType.FileCategory category;
        private final Set<AllowedFileType> exceptTypes = new HashSet<>();

        private CategoryBuilder(FileValidationConfigBuilder parent, AllowedFileType.FileCategory category) {
            this.parent = parent;
            this.category = category;
        }

        public CategoryBuilder except(AllowedFileType... fileTypes) {
            exceptTypes.addAll(Set.of(fileTypes));
            return this;
        }

        public FileValidationConfigBuilder and() {
            Set<AllowedFileType> categoryTypes = AllowedFileType.getByCategory(category).stream()
                    .filter(type -> !exceptTypes.contains(type))
                    .collect(Collectors.toSet());

            if (categoryTypes.isEmpty()) {
                throw new IllegalStateException("No file types remain after applying exceptions for category: " + category);
            }

            return parent.setAllowedFileTypes(categoryTypes);
        }
    }

    public record FileSizeBuilder(FileValidationConfigBuilder parent) {

        @Contract(" -> new")
        public @NotNull FileSizeUnitBuilder inMB() {
            return new FileSizeUnitBuilder(parent, FileSizeUnit.MB);
        }

        @Contract(" -> new")
        public @NotNull FileSizeUnitBuilder inKB() {
            return new FileSizeUnitBuilder(parent, FileSizeUnit.KB);
        }

        @Contract(" -> new")
        public @NotNull FileSizeUnitBuilder inGB() {
            return new FileSizeUnitBuilder(parent, FileSizeUnit.GB);
        }

        @Contract(" -> new")
        public @NotNull FileSizeUnitBuilder inBytes() {
            return new FileSizeUnitBuilder(parent, FileSizeUnit.BYTES);
        }
    }

    public record FileSizeUnitBuilder(FileValidationConfigBuilder parent, FileSizeUnit unit) {

        public FileValidationConfigBuilder max(long size) {
            return parent.setMaxSize(unit.toBytes(size));
        }

        public FileSizeUnitBuilder min(long size) {
            parent.setMinSize(unit.toBytes(size));
            return this;
        }

        public FileValidationConfigBuilder range(long minSize, long maxSize) {
            return parent.setMinSize(unit.toBytes(minSize))
                    .setMaxSize(unit.toBytes(maxSize));
        }

        public FileValidationConfigBuilder exactly(long size) {
            long bytes = unit.toBytes(size);
            return parent.setMinSize(bytes).setMaxSize(bytes);
        }
    }
}