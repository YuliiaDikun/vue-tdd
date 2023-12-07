import { mount } from "@vue/test-utils";
import SignUp from '../src/pages/SignUp.vue';


test("SignUp Component renders the correct text", () => {
    const wrapper = mount(SignUp);
    expect(wrapper.text()).toBe("Sign Up");
  });