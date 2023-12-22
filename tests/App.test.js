import { mount } from "@vue/test-utils";
import App from "../src/App.vue";
import waitForExpect from "wait-for-expect";
import i18n from "../src/locales/i18n";

describe("Routing", () => {
  test.each`
    path           | pageTestId
    ${"/"}         | ${"homepage"}
    ${"/signup"}   | ${"signup"}
    ${"/login"}    | ${"login"}
    ${"/user/1"}   | ${"user"}
    ${"/user/2"}   | ${"user"}
  `("displays $pageTestId at $path", (params) => {
    const { path, pageTestId } = params;

    window.history.pushState({}, "", path);
    const wrapper = mount(App, {
      global: {
        plugins: [i18n],
      },
    });
    const page = wrapper.find(`[data-test='${pageTestId}']`);
    expect(page.exists()).toBe(true);
  });

  test.each`
    path         | pageTestId
    ${"/"}       | ${"signUp"}
    ${"/"}       | ${"login"}
    ${"/signup"} | ${"homepage"}
    ${"/signup"} | ${"login"}
    ${"/login"}  | ${"homepage"}
    ${"/login"}  | ${"signup"}
  `("doest not display $pageTestId at $path", (params) => {
    const { path, pageTestId } = params;

    window.history.pushState({}, "", path);
    const wrapper = mount(App, {
      global: {
        plugins: [i18n],
      },
    });
    const page = wrapper.find(`[data-test='${pageTestId}']`);
    expect(page.exists()).toBe(false);
  });
});
