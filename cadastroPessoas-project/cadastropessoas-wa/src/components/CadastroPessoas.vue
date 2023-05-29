<template>
  <div class="container">
    <h1>Cadastro de Pessoas</h1>
    <button @click="openModal">Novo</button>
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Idade</th>
          <th>CPF</th>
          <th>Sexo</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in list" :key="person.id">
          <td>{{ person.name }}</td>
          <td>{{ formatDateToYearsOld(person.age) }} anos</td>
          <td>{{ formatCPF(person.cpf) }}</td>
          <td>{{ person.gender }}</td>
          <td class="action">
            <button class="action-button" @click="openEdit(person)">
              Editar
            </button>
            |
            <button class="action-button" @click="deletePerson(person)">
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showModal" class="the-modal">
      <div class="the-modal-content">
        <h2>Cadastrar Pessoa</h2>
        <div class="input-field">
          <label>Nome:</label>
          <input type="text" v-model="editingPerson.name" />
          <div v-if="errorMessages.name" class="error-message">
            {{ errorMessages.name }}
          </div>
        </div>
        <div class="input-field">
          <label>CPF:</label>
          <input type="text" v-model="editingPerson.cpf" />
          <div v-if="errorMessages.cpf" class="error-message">
            {{ errorMessages.cpf }}
          </div>
        </div>
        <div class="input-field">
          <label class="date-label">Nascimento:</label>
          <input type="date" v-model="editingPerson.age" />
          <div v-if="errorMessages.age" class="error-message-age">
            {{ errorMessages.age }}
          </div>
        </div>
        <div class="input-field">
          <label>Endereço:</label>
          <input type="text" v-model="editingPerson.address" />
          <div v-if="errorMessages.address" class="error-message">
            {{ errorMessages.address }}
          </div>
        </div>
        <div class="sex-input-field">
          <label class="sex-title">Sexo:</label>
          <div class="gender-container">
            <div class="each-field">
              <input
                type="checkbox"
                class="checkbox-round"
                value="Masculino"
                @change="changeSex($event)"
              />
              <span class="sex-label">Masculino</span>
            </div>
            <div class="each-field">
              <input
                type="checkbox"
                class="checkbox-round"
                value="Feminino"
                @change="changeSex($event)"
              />
              <span class="sex-label">Feminino</span>
            </div>
            <div v-if="errorMessages.gender" class="error-message">
              {{ errorMessages.gender }}
            </div>
          </div>
        </div>
        <div class="button-field">
          <button class="button" @click="savePerson()">Gravar</button>
          <button class="button" @click="closeModal">Cancelar</button>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="the-modal">
      <div class="the-modal-content">
        <h2>Editar Pessoa</h2>
        <div class="input-field">
          <label>Nome:</label>
          <input type="text" v-model="editingPerson.name" />
          <div v-if="errorMessages.name" class="error-message">
            {{ errorMessages.name }}
          </div>
        </div>
        <div class="input-field">
          <label>CPF:</label>
          <input type="text" v-model="editingPerson.cpf" />
          <div v-if="errorMessages.cpf" class="error-message">
            {{ errorMessages.cpf }}
          </div>
        </div>
        <div class="input-field">
          <label class="date-label">Nascimento:</label>
          <input type="date" v-model="editingPerson.age" />
          <div v-if="errorMessages.age" class="error-message-age">
            {{ errorMessages.age }}
          </div>
        </div>
        <div class="input-field">
          <label>Endereço:</label>
          <input type="text" v-model="editingPerson.address" />
          <div v-if="errorMessages.address" class="error-message">
            {{ errorMessages.address }}
          </div>
        </div>
        <div class="sex-input-field">
          <label class="sex-title">Sexo:</label>

          <div class="gender-container">
            <div class="each-field">
              <input
                type="checkbox"
                class="checkbox-round"
                value="Masculino"
                :checked="this.masculinoTrue"
                @change="changeSex($event)"
              />
              <span class="sex-label">Masculino</span>
            </div>
            <div class="each-field">
              <input
                type="checkbox"
                class="checkbox-round"
                value="Feminino"
                :checked="this.femininoTrue"
                @change="changeSex($event)"
              />
              <span class="sex-label">Feminino</span>
            </div>
            <div v-if="errorMessages.gender" class="error-message">
              {{ errorMessages.gender }}
            </div>
          </div>
        </div>
        <div class="button-field">
          <button class="button" @click="updatePerson(editingPerson)">
            Gravar
          </button>
          <button class="button" @click="closeModal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import services from "../services";
export default {
  data() {
    return {
      list: [],
      masculinoTrue: false,
      femininoTrue: false,
      showModal: false,
      showEditModal: false,
      editingPerson: {
        isNewPerson: false,
        name: "",
        cpf: "",
        age: "",
        address: "",
        gender: "",
      },
      errorMessages: {
        name: "",
        cpf: "",
        age: "",
        address: "",
        gender: "",
      },
    };
  },
  mounted() {
    this.loadPeople();
  },
  methods: {
    //Validações e formatadores
    validateCPF(cpf) {
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
    convertDateFormat(dateString) {
      const date = new Date(dateString);
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();

      return `${year}-${month}-${day}`;
    },
    formatDateToYearsOld(date) {
      const birthday = new Date(date);
      const birthYear = birthday.getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      return age;
    },
    formatCPF(cpf) {
      const numericString = cpf.replace(/\D/g, "");
      if (numericString.length !== 11) {
        return "CPF Inválido!";
      }

      // Formatar
      const formattedCPF = numericString.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
        "$1.$2.$3-$4"
      );

      return formattedCPF;
    },
    //Controlador dos inputs checkbox de sexo.
    changeSex(event) {
      console.log(event.target.defaultValue);
      try {
        if (this.editingPerson.gender === "") {
          this.editingPerson.gender = event.target.defaultValue;
        } else {
          if (
            this.editingPerson.gender === "Masculino" &&
            event.target.defaultValue === "Masculino"
          ) {
            this.editingPerson.gender = "";
            console.log("Era Masculino, ficou vazio.");
          } else if (
            this.editingPerson.gender === "Feminino" &&
            event.target.defaultValue === "Feminino"
          ) {
            this.editingPerson.gender = "";
            console.log("Era feminino, ficou vazio.");
          }
          if (
            (this.editingPerson.gender =
              "Masculino" && event.target.defaultValue === "Feminino")
          ) {
            console.log(
              "Era Masculino, ficou feminino ",
              event.target.defaultValue
            );
            this.editingPerson.gender = "Feminino";
          }
          if (
            (this.editingPerson.gender =
              "Feminino" && event.target.defaultValue === "Masculino")
          ) {
            console.log(
              "Era Feminino, ficou Masculino ",
              event.target.defaultValue
            );
            this.editingPerson.gender = "Masculino";
          } else {
            this.editingPerson.gender = event.target.defaultValue;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    //Carregando dados do banco
    async loadPeople() {
      await services.pessoas
        .getPessoas()
        .then((response) => {
          this.list = response;
          console.log("data: ", response);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // Modal de post
    openModal(person = null) {
      this.errorMessages = {
        name: "",
        cpf: "",
        age: "",
        address: "",
        gender: "",
      };
      this.editingPerson.isNewPerson = false;
      this.showModal = true;
      if (person) {
        this.editingPerson = Object.assign({}, person);
        this.editingPerson.isNewPerson = false;
      } else {
        this.editingPerson = {
          isNewPerson: true,
          name: "",
          cpf: "",
          age: "",
          address: "",
          gender: "",
        };
      }
    },
    //Modal de PUT
    openEdit(person = null) {
      this.femininoTrue = false;
      this.masculinoTrue = false;
      this.errorMessages = {
        name: "",
        cpf: "",
        age: "",
        address: "",
        gender: "",
      };
      this.showEditModal = true;
      var varAux = this.convertDateFormat(person.age);
      person.age = varAux;
      if (person.gender == "Masculino") {
        this.masculinoTrue = true;
        this.femininoTrue = false;
      }
      if (person.gender == "Feminino") {
        this.femininoTrue = true;
        this.masculinoTrue = false;
      }
      if (person) {
        this.editingPerson = Object.assign({}, person);
        this.editingPerson.isNewPerson = false;
      } else {
        this.editingPerson = {
          isNewPerson: true,
          name: "",
          cpf: "",
          age: "",
          address: "",
          gender: "",
        };
      }
    },

    //Fechar Modal
    closeModal() {
      this.showEditModal = false;
      this.showModal = false;
      this.editingPerson = {
        isNewPerson: true,
        name: "",
        cpf: "",
        age: "",
        address: "",
        gender: "",
      };
      this.errorMessages = {
        name: "Nome inválido!",
        cpf: "CPF inválido!",
        age: "Idade inválida!",
        address: "Endereço inválido!",
        gender: "Sexo inválido!",
      };
      this.loadPeople()
    },

    //Post
    savePerson() {
      // Limpar alerts de erro
      this.errorMessages = {
        name: "",
        cpf: "",
        age: "",
        address: "",
        gender: "",
      };

      //Validações
      let isValid = true;

      if (!this.editingPerson.name) {
        this.errorMessages.name = "Nome é obrigatório.";
        isValid = false;
      }

      if (!this.validateCPF(this.editingPerson.cpf)) {
        this.errorMessages.cpf = "CPF inválido.";
        isValid = false;
      }

      const MINIMUM_AGE = 18;
      var ageAux = new Date(this.editingPerson.age);
      var age = ageAux.getFullYear();
      const personAge = new Date().getFullYear() - age;
      if (personAge < MINIMUM_AGE) {
        this.errorMessages.age = "A pessoa deve ser maior de idade.";
        isValid = false;
      }

      if (isValid) {
        // Post pós validação
        var dateAux = new Date(this.editingPerson.age);
        var date = dateAux.toISOString();
        const pessoa = {
          name: this.editingPerson.name,
          age: date,
          cpf: this.editingPerson.cpf,
          address: this.editingPerson.address,
          gender: this.editingPerson.gender,
        };
        services.pessoas
          .addPessoa(pessoa)
          .then((response) => {
            const listaAtualizada = this.loadPeople();
            this.list = listaAtualizada.data;
            console.log("data: ", response);
          })
          .catch((error) => {
            console.error(error);
          });
        this.closeModal();
      }
    },

    //Put
    updatePerson(editingPerson) {
      // Limpar alerts de erro

      this.errorMessages = {
        name: "",
        cpf: "",
        age: "",
        address: "",
        gender: "",
      };

      // Validação
      let isValid = true;

      if (!editingPerson.name) {
        this.errorMessages.name = "Nome é obrigatório.";
        isValid = false;
      }

      if (!this.validateCPF(editingPerson.cpf)) {
        this.errorMessages.cpf = "CPF inválido.";
        isValid = false;
      }

      const MINIMUM_AGE = 18;
      var ageAux = new Date(editingPerson.age);
      var age = ageAux.getFullYear();
      const personAge = new Date().getFullYear() - age;
      if (personAge < MINIMUM_AGE) {
        this.errorMessages.age = "A pessoa deve ser maior de idade.";
        isValid = false;
      }

      if (isValid) {
        // Put
        var dateAux = new Date(editingPerson.age);
        var date = dateAux.toISOString();
        var id = editingPerson.id;
        const pessoa = {
          cpf: editingPerson.cpf,
          name: editingPerson.name,
          age: date,
          gender: editingPerson.gender,
          address: editingPerson.address,
        };
        services.pessoas
          .updatePessoa(id, pessoa)
          .then(() => {
            const listaAtualizada = this.loadPeople();
            this.list = listaAtualizada.data;
          })
          .catch((error) => {
            console.error(error);
          });
        this.closeModal();
      }
    },
    // Delete
    async deletePerson(person) {
      var id = person.id;
      await services.pessoas.deletePessoa(id);
      this.loadPeople()
    },
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  text-align: left;
  width: 100%;
  height: 100%;
}

.button {
  cursor: pointer;
}

.button:first-child {
  width: 4.7rem;
  padding: 5px;
  position: absolute;
  float: right;
  margin-right: 7rem;
}

.button:last-child {
  width: 4.7rem;
  padding: 5px;
  margin-right: 2rem;
  position: absolute;
  float: right;
}

table {
  border-collapse: separate;
  text-indent: initial;
  text-align: left;
  border-spacing: 0px;
  width: 100%;
  padding: 5px;
  border: none;
  font-weight: normal;
}

tbody td {
  border: none;
  padding: 2px;
}
button {
  width: 4rem;
  padding: 5px;
}
th {
  font-weight: normal;
}
tbody tr:hover {
  background-color: rgb(185, 185, 185, 0.7);
}

tbody tr:nth-child(odd):hover {
  background-color: rgb(185, 185, 185, 0.4);
}

tbody tr:nth-child(odd) {
  border: none;
  background-color: #f3f2f2;
}

thead tr {
  background-color: rgb(185, 185, 185, 0.7);
  padding: 5px;
}
tr {
  padding: 15px;
}
td {
  border: none;
  padding: 5px;
}

td:last-child {
  border: none;
  padding: 5px;
  justify-content: center;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.gender-container {
  gap: 2rem;
  display: flex;
  flex-direction: row;
  position: absolute;
  margin-left: -16rem;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.each-field {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-left: 3.5rem;
}

.each-field:last-child {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-left: 0.5rem;
}

.the-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.action {
  display: flex;
  flex-direction: row;
}

.the-modal-content {
  display: flex;
  flex-direction: column;
  width: 60%;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}

.sex-label {
  float: right;
  position: relative;
  margin-top: 4px;
}

.sex-title {
  position: relative;
  margin-left: -20rem;
  margin-top: 5px;
}

.date-label {
  position: absolute;
  margin-left: -267px;

  margin-top: 5px;
}

label {
  position: absolute;
  margin-left: -122px;
  margin-top: 5px;
}

input {
  width: 25rem;
  padding: 5px;
}

input[type="text"] {
  width: 25rem;
  position: relative;
}

input[type="date"] {
  width: 7rem;
  left: -9rem;
  position: relative;
}

input[type="checkbox"] {
  margin-left: 0.2rem;
  margin-right: 0.2rem;
}

.input-field {
  padding: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
}

.button-field {
  padding: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: right;
}

.action-button {
  color: rgb(96, 96, 255);
  cursor: pointer;
  border: none;
  background-color: transparent;
}

.sex-input-field {
  padding: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
}

.label-sex {
  margin-right: 10px;
}

.error-message {
  position: absolute;
  margin-left: 0.2rem;
  margin-top: 2rem;
  color: red;
  font-size: 12px;
}
.error-message-age {
  position: absolute;
  margin-left: -8.8rem;
  margin-top: 2.2rem;
  color: red;
  font-size: 12px;
}
.checkbox-round {
  width: 1.3em;
  height: 1.3em;
  background-color: white;
  border-radius: 50%;
  vertical-align: middle;
  border: 2px solid #ddd;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;
}

.checkbox-round:checked {
  border: 2px solid #ddd;
  background-color: rgb(108, 108, 255);
}
</style>
