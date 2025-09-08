package ecommerce.userprofile.shared.domain;

public interface Specification<T> {
    boolean isSatisfiedBy(T candidate);
}
