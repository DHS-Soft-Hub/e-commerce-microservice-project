package ecommerce.userprofile.shared.base;

public interface Specification<T> {
    boolean isSatisfiedBy(T candidate);
}
