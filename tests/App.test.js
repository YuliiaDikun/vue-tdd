import { mount } from "@vue/test-utils";
import App from "../src/App.vue";
import waitForExpect from "wait-for-expect";
import i18n from "../src/locales/i18n";

describe("Routing", () => {
  test("displays homepage at /", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n],
      },
    });
    const homePage = wrapper.find("[data-test='homepage']");
    expect(homePage.exists()).toBe(true);
  });

  test("Doest not display SignUpPage when at / ", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n],
      },
    });
    const signUp = wrapper.find("[data-test='signup']");
    expect(signUp.exists()).toBe(false);
  });

  test("displays signup page at /signup ", () => {
    window.history.pushState({}, "", "/signup");

    const wrapper = mount(App, {
      global: {
        plugins: [i18n],
      },
    });
    const signUp = wrapper.find("[data-test='signup']");
    expect(signUp.exists()).toBe(true);
  });

  test("Doest not display Homepage when at /signup ", () => {
    window.history.pushState({}, "", "/signup");
    const wrapper = mount(App, {
      global: {
        plugins: [i18n],
      },
    });
    const homePage = wrapper.find("[data-test='homepage']");
    expect(homePage.exists()).toBe(false);
  });
});
