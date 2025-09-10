package ecommerce.userprofile.shared.domain.entities;

import ecommerce.userprofile.shared.domain.valueobject.ValueObject;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public abstract class DomainEntity<ID extends ValueObject<?>> {
}