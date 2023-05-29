const services = axios.create({
  baseURL: "http://localhost:5186",
  headers: {
    "Content-Type": "application/json",
  },
});

var PeopleApp = {
 
  isNewPerson: true,
  list: [],
  showModal: false,
  editingPerson: {
    cpf: "",
    name: "",
    age: "",
    gender: "",
    address: "",
  },
  errorMessages: {},

  formatDateToYearsOld: function (date) {
    //Formatar data de aniversário em idade
    var aniversario = new Date(date);
    var hoje = new Date();
    var anoAniversario = aniversario.getFullYear();
    var anoAtual = hoje.getFullYear();
    return anoAtual - anoAniversario;
  },
  formatDate: function (date) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  },
  loadPeople: async function () {
    try {
      const response = await services.get("/Pessoas");
      PeopleApp.list = response.data;
      console.log("data: ", response.data);
    } catch (error) {
      console.log(error);
    }
  },

  // Validação simplificada do CPF
  validateCPF: function (cpf) {
    if (!cpf || cpf.length !== 11 || !/^\d+$/.test(cpf)) {
      return false;
    }

    var cpfArray = cpf.split("").map(Number);
    var sum = cpfArray.slice(0, 9).reduce(function (acc, value, index) {
      return acc + value * (10 - index);
    }, 0);
    var mod = sum % 11;
    var digit1 = mod < 2 ? 0 : 11 - mod;

    if (cpfArray[9] !== digit1) {
      return false;
    }

    sum = cpfArray.slice(0, 10).reduce(function (acc, value, index) {
      return acc + value * (11 - index);
    }, 0);
    mod = sum % 11;
    var digit2 = mod < 2 ? 0 : 11 - mod;

    return cpfArray[10] === digit2;
  },

  // Validação simplificada da data
  validateDate: function (dateString) {
    var date = new Date(dateString);
    var today = new Date();
    var anoAtual = today.getFullYear();
    var anoSelecionado = date.getFullYear();
    var resultado = anoAtual - anoSelecionado;
    if (resultado < 18) {
      return;
    } else {
      return date;
    }
  },

  openModal: function (person) {
    PeopleApp.editingPerson = person ? Object.assign({}, person) : null;
    PeopleApp.errorMessages = {};
    PeopleApp.showModal = true;
  },

  closeModal: async function () {
    PeopleApp.showModal = false;
  },

  savePerson: async function () {
    var person = PeopleApp.editingPerson;

    var isNewPerson = !person.hasOwnProperty("id");
    // Validar campos
    var errors = {};

    if (!person.name) {
      errors.name = "Nome é obrigatório";
    }

    if (!PeopleApp.validateCPF(person.cpf)) {
      errors.cpf = "CPF inválido";
    }

    if (!PeopleApp.validateDate(person.age)) {
      errors.age = "Data de nascimento inválida";
    }

    if (!person.address) {
      errors.address = "Endereço é obrigatório";
    }

    if (!person.gender) {
      errors.gender = "Sexo é obrigatório";
    }

    if (Object.keys(errors).length > 0) {
      PeopleApp.errorMessages = errors;
      return;
    }

    //Verificar se é um post ou put
    if (isNewPerson) {
      try {
        console.log("Person antes de formatar: ", person);
        delete person.isTrusted;
        delete person.id;
        person.age = new Date(person.age);
        console.log("Person antes de post: ", person);
        await services.post("/Pessoas", person);
      } catch (error) {
        console.log(error);
      }
    } else {
      // Atualizar pessoa existente
      var index = PeopleApp.list.findIndex(function (p) {
        return p.id === person.id;
      });

      if (index !== -1) {
        PeopleApp.list[index] = person;
        try {
          console.log(person, "Person no UPDATE!!");
          await services.put(`/Pessoas/${person.id}`, person);
        } catch (error) {
          console.log(error);
        }
      }
    }

    PeopleApp.showModal = false;
  },

  deletePerson: async function (person) {
    try {
      var index = PeopleApp.list.findIndex(function (p) {
        return p.id === person.id;
      });

      if (index !== -1) {
        await services.delete(`/Pessoas/${person.id}`);
        PeopleApp.list.splice(index, 1);
        PeopleApp.loadPeople()
      }
    } catch (error) {
      console.log(error);
    }
  },
};

var PeopleList = {
  list: [],
  oninit: async function(vnode) {
    const response = await services.get("/Pessoas")
    PeopleList.list = response.data
    
},
  view: function () {
    return m(".container", [
      m("h1", "Cadastro de Pessoas"),
      m("button", { onclick: PeopleApp.openModal }, "Novo"),
      m("table", [ 
        m("thead", [
          m("tr", [
            m("th", "Nome"),
            m("th", "Idade"),
            m("th", "CPF"),
            m("th", "Sexo"),
            m("th"),
          ]),
        ]),
        m("tbody",
        [ 
          PeopleApp.list.map(function (person) {
            
            //Formatar data de aniversário em idade
            function formatDateToYearsOld(date) {
              var aniversario = new Date(date);
              var anoAniversario = aniversario.getFullYear();
              var anoAtual = new Date().getFullYear();
              var idade = anoAtual - anoAniversario;
              return idade;
            }
            return m("tr", [
              m("td", person.name),
              m("td", formatDateToYearsOld(person.age)),
              m("td", person.cpf),
              m("td", person.gender),
              m("td.action", [
                m(
                  "button.action-button",
                  {
                    onclick: function () {
                      PeopleApp.openModal(person);
                    },
                  },
                  "Editar"
                  ),
                  m("", "|"),
                  m(
                    "button.action-button",
                    {
                      onclick: function () {
                        PeopleApp.deletePerson(person);
                      },
                    },
                    "Excluir"
                    ),
                  ]),
                ]);
              }),
            ]),
          ]),
          PeopleApp.showModal &&
          m(".the-modal", [
            m(".the-modal-content", [
              m(
                "h2",
                (PeopleApp.editingPerson.isNewPerson ? "Cadastrar" : "Editar") + " Pessoa"
            ),
            m(".input-field", [
              m("label", "Nome:"),
              m("input[type=text]", {
                value: PeopleApp.editingPerson
                ? PeopleApp.editingPerson.name
                : "",
                oninput: function (e) {
                  PeopleApp.editingPerson.name = e.target.value;
                },
              }),
              PeopleApp.errorMessages.name &&
              m(".error-message", PeopleApp.errorMessages.name),
            ]),
            m(".input-field", [
              m("label", "CPF:"),
              m("input[type=text]", {
                value: PeopleApp.editingPerson
                ? PeopleApp.editingPerson.cpf
                : "",
                oninput: function (e) {
                  PeopleApp.editingPerson.cpf = e.target.value;
                },
              }),
              PeopleApp.errorMessages.cpf &&
                m(".error-message", PeopleApp.errorMessages.cpf),
              ]),
            m(".input-field", [
              m("label", "Nascimento:"),
              m("input[type=date]", {
                value: PeopleApp.editingPerson
                ? PeopleApp.editingPerson.age
                : "",
                oninput: function (e) {
                  PeopleApp.editingPerson.age = e.target.value;
                },
              }),
              PeopleApp.errorMessages.age &&
              m(".error-message", PeopleApp.errorMessages.age),
            ]),
            m(".input-field", [
              m("label", "Endereço:"),
              m("input[type=text]", {
                value: PeopleApp.editingPerson
                ? PeopleApp.editingPerson.address
                : "",
                oninput: function (e) {
                  PeopleApp.editingPerson.address = e.target.value;
                },
              }),
              PeopleApp.errorMessages.address &&
              m(".error-message", PeopleApp.errorMessages.address),
            ]),
            m(".sex-input-field", [
              m("label", "Sexo:"),
              m(
                ".each-field",
                {
                  onchange: function (e) {
                    PeopleApp.editingPerson.gender = e.target.value;
                  },
                },
                [
                  m(
                    "input[type=checkbox].checkbox-round",
                    {
                      value: "Masculino",
                      selected:
                      PeopleApp.editingPerson &&
                      PeopleApp.editingPerson.gender === "M",
                    },
                    "Masculino"
                    ),
                    m(".sex-label", "Masculino"),
                  ]
                  ),
              m(
                ".each-field",
                {
                  onchange: function (e) {
                    PeopleApp.editingPerson.gender = e.target.value;
                  },
                },
                [
                  m(
                    "input[type=checkbox].checkbox-round",
                    {
                      value: "Feminino",
                      selected:
                      PeopleApp.editingPerson &&
                      PeopleApp.editingPerson.gender === "F",
                    },
                    "Feminino"
                    ),
                    m(".sex-label", "Feminino"),
                  ]
                  ),
                  PeopleApp.errorMessages.gender &&
                  m(".error-message", PeopleApp.errorMessages.gender),
                ]),
                m(".button-field", [
                  m("button.button", { onclick: PeopleApp.savePerson }, "Gravar"),
                  m("button.button", { onclick: PeopleApp.closeModal }, "Cancelar"),
                ]),
              ]),
            ]),
          ]);
        },
      };
      
// Get no banco
PeopleApp.loadPeople();

//Montar o app Mithril
m.mount(document.getElementById("app"), PeopleList );
