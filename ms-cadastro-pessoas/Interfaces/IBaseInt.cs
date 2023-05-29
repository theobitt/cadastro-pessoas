using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ms_cadastro_pessoas.Interfaces
{
    public interface IBaseInt<in T, out A>
    {
        A CadastrarPessoa(T obj);
        IEnumerable<A>BuscarTodos();
        A BuscarPorId(int id);

        bool excluir(int id);
 
    }
}