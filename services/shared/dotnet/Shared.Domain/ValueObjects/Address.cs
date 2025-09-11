namespace Shared.Domain.ValueObjects
{
    public sealed class Address : ValueObject
    {
        public string Street { get; private set; }
        public string City { get; private set; }
        public string State { get; private set; }
        public string PostalCode { get; private set; }
        public string Country { get; private set; }

        public Address(string street, string city, string state, string postalCode, string country)
        {
            if (string.IsNullOrWhiteSpace(street))
                throw new ArgumentException("Street cannot be null or empty");
            if (string.IsNullOrWhiteSpace(city))
                throw new ArgumentException("City cannot be null or empty");
            if (string.IsNullOrWhiteSpace(country))
                throw new ArgumentException("Country cannot be null or empty");

            Street = street;
            City = city;
            State = state ?? string.Empty;
            PostalCode = postalCode ?? string.Empty;
            Country = country;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Street;
            yield return City;
            yield return State;
            yield return PostalCode;
            yield return Country;
        }

        public override string ToString() => $"{Street}, {City}, {State} {PostalCode}, {Country}";
    }
}