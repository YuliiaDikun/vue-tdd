import { mount } from "@vue/test-utils";
import App from "../src/App.vue";
import i18n from "../src/locales/i18n";
import waitForExpect from "wait-for-expect";

const setup = (path) => {
  window.history.pushState({}, "", path);
  const wrapper = mount(App, {
    global: {
      plugins: [i18n],
    },
  });
  return wrapper;
};

describe("Routing", () => {
  test.each`
    path         | pageTestId
    ${"/"}       | ${"homepage"}
    ${"/signup"} | ${"signup"}
    ${"/login"}  | ${"login"}
    ${"/user/1"} | ${"user"}
    ${"/user/2"} | ${"user"}
  `("displays $pageTestId at $path", (params) => {
    const { path, pageTestId } = params;
    const wrapper = setup(path);

    const page = wrapper.find(`[data-test='${pageTestId}']`);
    expect(page.exists()).toBe(true);
  });

  test.each`
    path         | pageTestId
    ${"/"}       | ${"signUp"}
    ${"/"}       | ${"login"}
    ${"/"}       | ${"user"}
    ${"/signup"} | ${"homepage"}
    ${"/signup"} | ${"login"}
    ${"/signup"} | ${"user"}
    ${"/login"}  | ${"homepage"}
    ${"/login"}  | ${"signup"}
    ${"/login"}  | ${"user"}
    ${"/user/1"} | ${"homepage"}
    ${"/user/1"} | ${"signUp"}
    ${"/user/1"} | ${"login"}
  `("doest not display $pageTestId at $path", (params) => {
    const { path, pageTestId } = params;

    const wrapper = setup(path);

    const page = wrapper.find(`[data-test='${pageTestId}']`);
    expect(page.exists()).toBe(false);
  });

  test.each`
    targetPage
    ${"home"}
    ${"signup"}
    ${"login"}
  `("has link to $targetPage on NavBar", (params) => {
    const { targetPage } = params;
    const wrapper = setup("/");
    const homeLink = wrapper.find(`[data-test='${targetPage}Link']`);
    expect(homeLink.exists()).toBe(true);
  });

  test.each`
    initialPath  | clickingTo  | visiblePage
    ${"/"}       | ${"signup"} | ${"signup"}
    ${"/singup"} | ${"home"}   | ${"homepage"}
    ${"/"}       | ${"login"}  | ${"login"}
  `(
    "displays $visiblePage page after clicking $clickingTo link at $initialPath page",
    async (params) => {
      const { initialPath, clickingTo, visiblePage } = params;
      const wrapper = setup(initialPath);
      const link = wrapper.find(`[data-test='${clickingTo}Link']`);

      await link.trigger("click");

      waitForExpect(() => {
        const page = wrapper.find(`[data-test='${visiblePage}']`);
        expect(page.exists()).toBe(true);
      });
    }
  );
});
