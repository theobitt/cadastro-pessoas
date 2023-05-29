using AutoMapper;
using ms_cadastro_pessoas.Model;
using ms_cadastro_pessoas.Model.Dto;

namespace ms_cadastro_pessoas.Profiles
{
    public class PessoaProfile : Profile
    {
        public PessoaProfile(){
            CreateMap<AddPessoaDto, Pessoa>();
            CreateMap<Pessoa, ReadPessoaDto>();
            CreateMap<UpdatePessoaDto, Pessoa>();
        }
    }
}