namespace Shared.Domain.Common;

public class Result
{
    public bool IsSuccess { get; private set; }
    public bool IsFailure => !IsSuccess;
    public IReadOnlyList<string> Errors { get; private set; }

    private Result(bool isSuccess, IReadOnlyList<string>? errors)
    {
        IsSuccess = isSuccess;
        Errors = errors ?? new List<string>();
    }

    public static Result Success() => new(true, null);
    public static Result Failure(string error) => new(false, new[] { error });
    public static Result Failure(IEnumerable<string> errors) => new(false, errors?.ToList() ?? new List<string>());

    // Combine multiple results (useful for domain validation)
    public static Result Combine(params Result[] results)
    {
        var errors = results.Where(r => !r.IsSuccess).SelectMany(r => r.Errors);
        return errors.Any() ? Failure(errors) : Success();
    }

}

public class Result<T>
{
    public bool IsSuccess { get; private set; }
    public bool IsFailure => !IsSuccess;
    public IReadOnlyList<string> Errors { get; private set; }
    public T? Value { get; private set; }

    private Result(bool isSuccess, IReadOnlyList<string>? errors, T? value = default)
    {
        IsSuccess = isSuccess;
        Errors = errors ?? new List<string>();
        Value = value;
    }

    public static Result<T> Success(T value) => new(true, null, value);
    public static Result<T> Failure(string error) => new(false, new[] { error });
    public static Result<T> Failure(IEnumerable<string> errors) => new(false, errors?.ToList() ?? new List<string>(), default);

    // Domain-specific helper methods

    public static Result<T> FailureFromDomainException(DomainException ex)
        => new(false, new[] { ex.Message }, default);
}