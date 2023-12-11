import { mount } from "@vue/test-utils";
import SignUp from "../src/pages/SignUp.vue";

describe("Sign Up Page", () => {
  describe("layout", () => {
    test("SignUp Component renders the correct text", () => {
      const wrapper = mount(SignUp);
      expect(wrapper.find("h1").exists()).toBe(true);
    });

    test("inputs data-tests attributes", () => {
      const wrapper = mount(SignUp);
      expect(wrapper.find('[data-test="username"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="email"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="password"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="password-repeat"]').exists()).toBe(true);
    });

    test("has password type for input", () => {
      const wrapper = mount(SignUp);
      const inputLength = wrapper.findAll('[type="password"]').length;
      expect(inputLength).toBe(2);
    });

    test("SignUp Component renders the singUp button", () => {
      const wrapper = mount(SignUp);
      const signUpButton = wrapper.find("button");
      expect(signUpButton.exists()).toBe(true);
      expect(signUpButton.attributes('type')).toBe('submit');
      expect(signUpButton.attributes('disabled')).toBe('disabled');
    });

    test("SingUp button is disabled initially", () => {
      const wrapper = mount(SignUp);
      const signUpButton = wrapper.find("button");      
      expect(signUpButton.attributes('disabled')).toBe('disabled');
    });
  });
});
