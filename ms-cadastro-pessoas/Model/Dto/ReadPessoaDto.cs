using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


namespace ms_cadastro_pessoas.Model.Dto
{
    public class ReadPessoaDto
    {   
        [Key]
        [Column("id")]
        public int Id { get; set; }
        public string Cpf { get; set; }

        public string Name { get; set; } = null!;

        public DateTime Age { get; set; }

        public string Gender { get; set; } = null!;

        public string Address { get; set; }
    }

}