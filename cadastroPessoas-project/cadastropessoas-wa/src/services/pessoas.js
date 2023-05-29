export default (httpClient) => ({
  getPessoas: async () => {
    try {
      const response = await httpClient.get("/Pessoas");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  addPessoa: async (pessoa) => {
    try {
      const response = await httpClient.post("/Pessoas/", pessoa);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  updatePessoa: async (id, pessoa) => {
    try {
      const response = await httpClient.put(`/Pessoas/${id}`, pessoa);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  deletePessoa: async (id) => {
    try {
      const response = await httpClient.delete(`/Pessoas/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
});
