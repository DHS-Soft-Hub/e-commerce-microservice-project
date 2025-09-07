package ecommerce.userprofile.shared.types;

public enum FileSizeUnit {
    BYTES(1L),
    KB(1024L),
    MB(1024L * 1024L),
    GB(1024L * 1024L * 1024L),
    TB(1024L * 1024L * 1024L * 1024L);

    private final long bytesMultiplier;

    public static final String NEGATIVE_SIZE_MESSAGE = "Size cannot be negative";
    public static final String NEGATIVE_BYTES_MESSAGE = "Bytes cannot be negative";

    FileSizeUnit(long bytesMultiplier) {
        this.bytesMultiplier = bytesMultiplier;
    }

    public long toBytes(long size) {
        if (size < 0) throw new IllegalArgumentException(NEGATIVE_SIZE_MESSAGE);

        return size * bytesMultiplier;
    }

    public double fromBytes(long bytes) {
        if (bytes < 0) throw new IllegalArgumentException(NEGATIVE_BYTES_MESSAGE);

        return (double) bytes / bytesMultiplier;
    }

    public static long maxBytes(long size) {
        return BYTES.toBytes(size);
    }

    public static long maxKB(long size) {
        return KB.toBytes(size);
    }

    public static long maxMB(long size) {
        return MB.toBytes(size);
    }

    public static long maxGB(long size) {
        return GB.toBytes(size);
    }

    public static long maxTB(long size) {
        return TB.toBytes(size);
    }
}
