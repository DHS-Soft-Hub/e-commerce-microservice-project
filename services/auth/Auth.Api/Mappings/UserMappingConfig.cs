using Auth.Api.Entities;
using Mapster;
using Auth.Api.Contracts.Responses;

namespace Auth.Api.Mappings
{
    public class UserMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<AuthUser, AuthUserResponse>();
        }
    }
}
