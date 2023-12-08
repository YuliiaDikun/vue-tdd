import { mount } from "@vue/test-utils";
import SignUp from "../src/pages/SignUp.vue";

describe("Sign Up Page", () => {
  describe("layout", () => {
    test("SignUp Component renders the correct text", () => {
      const wrapper = mount(SignUp);
      expect(wrapper.find("h1").exists()).toBe(true);
    });
    test('it has a username input', () => {
      const wrapper = mount(SignUp);
      const input = wrapper.find('[data-test="input"]');
      expect(input.exists()).toBe(true)
    })
    test('it has a email input', () => {
      const wrapper = mount(SignUp);
      const input = wrapper.findAll('[data-test="input"]').length;
      expect(input).toBe(2)
    })
  });
});
