using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ms_cadastro_pessoas.Model;

namespace ms_cadastro_pessoas.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(){

        }
        public AppDbContext(DbContextOptions<AppDbContext> options ): base(options){
            
        }
        public virtual DbSet<Pessoa> Pessoas { get; set;}
    }
}