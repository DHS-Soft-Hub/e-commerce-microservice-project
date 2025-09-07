package ecommerce.userprofile.shared.base;

import ecommerce.userprofile.shared.exceptions.DomainException;

import java.io.Serializable;

/**
 * Marker interface for Value Objects following DDD principles.
 */
public interface ValueObject<T> extends Serializable {

    /**
     * Validates the value object's state.
     *
     * @throws DomainException if validation fails
     */
    void validate(T value);
}