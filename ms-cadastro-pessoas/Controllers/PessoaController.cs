using Microsoft.AspNetCore.Mvc;
using ms_cadastro_pessoas.Interfaces;
using ms_cadastro_pessoas.Model.Dto;

namespace ms_cadastro_pessoas.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PessoasController : ControllerBase
    {

        private readonly IPessoas _interfaces;

        public PessoasController(IPessoas interfaces)
        {
            _interfaces = interfaces;
        }
        [HttpPost]
        public IActionResult CadastrarPessoa(AddPessoaDto dto)
        {
            var pessoa = _interfaces.CadastrarPessoa(dto);
            if (pessoa != null)
            {
                return Ok(pessoa);
            }

            return BadRequest("Não foi possível cadastrar a Pessoa");

        }

        [HttpGet]
        public IActionResult BuscarPessoas()
        {
            IEnumerable<ReadPessoaDto> Pessoas = _interfaces.BuscarTodos();
            if(Pessoas == null){
                return NoContent();
            } 
            return Ok(Pessoas);
        }

        [HttpGet("{id}")]

        public IActionResult BuscarPessoaPorId(int id)
        {
            ReadPessoaDto dto = _interfaces.BuscarPorId(id);
            if(dto == null){
                return BadRequest("Não foi possível encontrar a pessoa com id" + id);
            }
            return Ok(dto);
        }

        [HttpPut("{id}")]

        public IActionResult AtualizarPessoa(int id,UpdatePessoaDto dto )
        {
            ReadPessoaDto readDto = _interfaces.Editar(id, dto);
            if(dto == null){
                return BadRequest("Não foi possível editar a pessoa com id" + id);
            }
            return Ok(dto);
        }

        [HttpDelete("{id}")]

        public IActionResult DeletarPessoa(int id)
        {
            bool deletado = _interfaces.excluir(id);
            if(deletado == true){
                return Ok();
            }
            return BadRequest("Não foi possível excluir a pessoa com id" + id);
           
        }
    }
}
    
