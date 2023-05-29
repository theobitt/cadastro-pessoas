using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ms_cadastro_pessoas.Data;
using ms_cadastro_pessoas.Interfaces;
using ms_cadastro_pessoas.Model;
using ms_cadastro_pessoas.Model.Dto;

namespace ms_cadastro_pessoas.Domain
{
    public class PessoaDomain : IPessoas
    {

        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public PessoaDomain(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        public ReadPessoaDto CadastrarPessoa(AddPessoaDto dto)
        {
            Pessoa pessoa = _mapper.Map<Pessoa>(dto);
            _context.Pessoas.Add(pessoa);
            _context.SaveChanges();
            ReadPessoaDto PessoaDto = _mapper.Map<ReadPessoaDto>(pessoa);
            return PessoaDto;
        }

        public ReadPessoaDto BuscarPorId(int id)
        {
            Pessoa pessoa = _context.Pessoas.FirstOrDefault(pessoa => pessoa.Id == id);
            ReadPessoaDto readDto = _mapper.Map<ReadPessoaDto>(pessoa);
            return readDto;
        }
        public IEnumerable<ReadPessoaDto> BuscarTodos()
        {
            var listaPessoas = _context.Pessoas.ToList();
            IEnumerable<ReadPessoaDto> readPessoaDtos = _mapper.Map<List<ReadPessoaDto>>(listaPessoas);
            return readPessoaDtos;
        }

    

        public ReadPessoaDto Editar(int id, UpdatePessoaDto dto)
        {
            Pessoa pessoa = _context.Pessoas.FirstOrDefault(pessoa => pessoa.Id == id);
            if (pessoa != null)
            {
                // pessoa.Name = dto.Name;
                // pessoa.Cpf = dto.Cpf;
                // pessoa.Gender = dto.Gender;
                // pessoa.Age = dto.Age;
                // pessoa.Address = dto.Address;
                _mapper.Map(dto, pessoa);
                ReadPessoaDto readPessoaDto = _mapper.Map<ReadPessoaDto>(pessoa);
                _context.SaveChanges();
                return readPessoaDto;
            }
            return null;
        }

        public bool excluir(int id)
        {
            Pessoa pessoa = _context.Pessoas.FirstOrDefault(pessoa => pessoa.Id == id);
            if (pessoa != null)
            {
                _context.Remove(pessoa);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
