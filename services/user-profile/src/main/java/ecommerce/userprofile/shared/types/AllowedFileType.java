package ecommerce.userprofile.shared.types;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Unmodifiable;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public enum AllowedFileType {
    JPEG("jpeg", Set.of("jpg", "jpeg"), "image/jpeg", FileCategory.IMAGE),
    PNG("png", Set.of("png"), "image/png", FileCategory.IMAGE),
    WEBP("webp", Set.of("webp"), "image/webp", FileCategory.IMAGE),
    HEIC("heic", Set.of("heic", "heif"), "image/heic", FileCategory.IMAGE),
    GIF("gif", Set.of("gif"), "image/gif", FileCategory.IMAGE),

    PDF("pdf", Set.of("pdf"), "application/pdf", FileCategory.DOCUMENT),
    DOCX("docx", Set.of("docx"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", FileCategory.DOCUMENT),
    TXT("txt", Set.of("txt"), "text/plain", FileCategory.DOCUMENT);

    private final String displayName;
    private final Set<String> extensions;
    private final String mimeType;
    private final FileCategory category;

    public boolean matchesExtension(@NotNull String extension) {
        return extensions.contains(extension.toLowerCase());
    }

    public boolean matchesMimeType(@NotNull String mimeType) {
        return this.mimeType.equalsIgnoreCase(mimeType);
    }

    @Contract(value = " -> new", pure = true)
    public static @NotNull @Unmodifiable Set<AllowedFileType> getImageTypes() {
        return Set.of(JPEG, PNG, WEBP, HEIC, GIF);
    }

    @Contract(value = " -> new", pure = true)
    public static @NotNull @Unmodifiable Set<AllowedFileType> getDocumentTypes() {
        return Set.of(PDF, DOCX, TXT);
    }

    @Contract(value = "_ -> new", pure = true)
    public static @NotNull @Unmodifiable Set<AllowedFileType> getByCategory(@NotNull FileCategory category) {
        return Arrays.stream(values())
                .filter(type -> type.category == category)
                .collect(Collectors.toUnmodifiableSet());
    }

    public enum FileCategory {
        IMAGE, DOCUMENT, AUDIO, VIDEO
    }
}
