import { shallowMount } from "@vue/test-utils";
import CadastroPessoas from "@/components/CadastroPessoas.vue";

describe("CadastroPessoas.vue", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  it("renders props.msg when passed", () => {
    const wrapper = shallowMount(CadastroPessoas);
    wrapper.setData({
      editingPerson: {
        isNewPerson: true,
        name: "Marlin",
        cpf: "14938754532",
        age: "1994-06-13 21:00:00-03",
        address: "R Do Marlon",
        gender: "Masculino",
      },
    });
    expect(wrapper.vm.savePerson()).toHaveReturned("CPF inválido!");
  });
  it('Deve abrir modal quando o botão "Novo" é clicado', async () => {
    await page.click('button:has-text("Novo")');
    const modalVisible = await page.isVisible(".the-modal");
    expect(modalVisible).toBe(true);
  });
});
