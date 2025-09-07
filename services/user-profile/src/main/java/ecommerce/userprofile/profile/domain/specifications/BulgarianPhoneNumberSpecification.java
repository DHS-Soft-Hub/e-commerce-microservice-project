package ecommerce.userprofile.profile.domain.specifications;

import ecommerce.userprofile.shared.types.IsoCountry;
import org.jetbrains.annotations.NotNull;

/**
 * Bulgarian phone number validation and normalization.
 * Supports formats: +359[8-9]XXXXXXXX or 0[8-9]XXXXXXXX
 */
public class BulgarianPhoneNumberSpecification implements PhoneNumberSpecification {

    /**
     * Removes whitespace, hyphens and parentheses
     */
    private static final String WHITESPACE_AND_FORMATTING_CHARS = "[\\s\\-\\(\\)]";

    /**
     * Matches legacy international prefix 00359
     */
    private static final String INTERNATIONAL_PREFIX_PATTERN = "^00359";

    /**
     * Standard international prefix replacement
     */
    private static final String INTERNATIONAL_PREFIX_REPLACEMENT = "+359";

    /**
     * Valid Bulgarian phone number pattern
     */
    private static final String VALID_PHONE_NUMBER_PATTERN = "^(\\+359|0)[789]\\d{8}$";

    @Override
    public String normalize(@NotNull String phoneNumber) {
        return phoneNumber
                .replaceAll(WHITESPACE_AND_FORMATTING_CHARS, "")
                .replaceAll(INTERNATIONAL_PREFIX_PATTERN, INTERNATIONAL_PREFIX_REPLACEMENT);
    }

    @Override
    public IsoCountry getIsoCountry() {
        return IsoCountry.BULGARIA;
    }

    @Override
    public boolean isSatisfiedBy(String candidate) {
        if (candidate == null || candidate.isBlank()) return false;

        String normalizedCandidate = normalize(candidate);

        return normalizedCandidate.matches(VALID_PHONE_NUMBER_PATTERN);
    }
}
