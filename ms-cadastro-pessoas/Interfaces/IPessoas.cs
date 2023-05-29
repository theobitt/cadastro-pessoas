using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ms_cadastro_pessoas.Model.Dto;

namespace  ms_cadastro_pessoas.Interfaces
{
    public interface IPessoas : IBaseInt<AddPessoaDto, ReadPessoaDto>, IUpdate<UpdatePessoaDto, ReadPessoaDto>
    {
    }
}