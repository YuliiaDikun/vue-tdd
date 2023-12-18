import Input from "../src/components/Input.vue";
import { mount } from "@vue/test-utils";


test("has invalid class for input when help is set", () => {
  const wrapper = mount(Input, {
    props: {
      help: "Username cannot be null",
    },
  });
const input = wrapper.find('input')
expect(input.classes()).toContain('border-red-500')
});

test("does not have invalid class for input when help is set", () => {
    const wrapper = mount(Input, {
      props: {
        help: undefined,
      },
    });
  const input = wrapper.find('input')
  expect(input.classes('border-red-500')).toBe(false)
  });