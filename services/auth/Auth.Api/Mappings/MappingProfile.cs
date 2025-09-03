using Auth.Api.Entities;
using Auth.Api.DTOs;
using Mapster;

namespace Auth.Api.Mappings
{
    public class MappingProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<AuthUser, AuthUserDto>().Map(dest => dest.Id, src => src.Id)
                                                      .Map(dest => dest.Email, src => src.Email)
                                                      .Map(dest => dest.UserName, src => src.UserName);
        }
    }
}
