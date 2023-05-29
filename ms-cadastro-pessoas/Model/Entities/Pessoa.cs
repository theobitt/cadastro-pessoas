using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ms_cadastro_pessoas.Model
{
    [Table("pessoa")]
    public class Pessoa
    {   
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("cpf")]
        [Required]
        public string Cpf { get; set; }

        [Column("name")]
        [Required]
        public string Name { get; set; } = null!;

        [Column("age")]
        [Required]
        public DateTime Age { get; set; }

        [Column("gender")]
        [Required]
        public string Gender { get; set; } = null!;

        [Column("address")]
        [Required]
        public string Address { get; set; }

    }

}