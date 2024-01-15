import { mount } from "@vue/test-utils";
import App from "../src/App.vue";
import i18n from "../src/locales/i18n";
import router from "../src/routes/router";
import waitForExpect from "wait-for-expect";

const setup = async (path) => {
  const wrapper = mount(App, {
    global: {
      plugins: [i18n, router],
    },
  });
  router.replace(path);
  await router.isReady();
  return wrapper;
};

describe("Routing", () => {
  test.each`
    path                  | pageTestId
    ${"/"}                | ${"homepage"}
    ${"/signup"}          | ${"signup"}
    ${"/login"}           | ${"login"}
    ${"/user/1"}          | ${"user"}
    ${"/user/2"}          | ${"user"}
    ${"/activate/436432"} | ${"activation"}
    ${"/activate/564572"} | ${"activation"}
  `("displays $pageTestId at $path", async (params) => {
    const { path, pageTestId } = params;
    const wrapper = await setup(path);

    waitForExpect(() => {
      const page = wrapper.find(`[data-test='${pageTestId}']`);
      expect(page.exists()).toBe(true);
    });
  });

  test.each`
    path                  | pageTestId
    ${"/"}                | ${"signUp"}
    ${"/"}                | ${"login"}
    ${"/"}                | ${"user"}
    ${"/"}                | ${"activation"}
    ${"/signup"}          | ${"homepage"}
    ${"/signup"}          | ${"login"}
    ${"/signup"}          | ${"user"}
    ${"/signup"}          | ${"activation"}
    ${"/login"}           | ${"homepage"}
    ${"/login"}           | ${"signup"}
    ${"/login"}           | ${"user"}
    ${"/login"}           | ${"activation"}
    ${"/user/1"}          | ${"homepage"}
    ${"/user/1"}          | ${"signUp"}
    ${"/user/1"}          | ${"login"}
    ${"/user/1"}          | ${"activation"}
    ${"/activate/564572"} | ${"signUp"}
    ${"/activate/564572"} | ${"login"}
    ${"/activate/564572"} | ${"user"}
    ${"/activate/564572"} | ${"homepage"}
  `("doest not display $pageTestId at $path", async (params) => {
    const { path, pageTestId } = params;

    const wrapper = await setup(path);

    waitForExpect(() => {
      const page = wrapper.find(`[data-test='${pageTestId}']`);
      expect(page.exists()).toBe(false);
    });
  });

  test.each`
    targetPage
    ${"home"}
    ${"signup"}
    ${"login"}
  `("has link to $targetPage on NavBar", async (params) => {
    const { targetPage } = params;
    const wrapper = await setup("/");
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
      const wrapper = await setup(initialPath);
      const link = wrapper.find(`[data-test='${clickingTo}Link']`);

      await link.trigger("click");

      waitForExpect(() => {
        const page = wrapper.find(`[data-test='${visiblePage}']`);
        expect(page.exists()).toBe(true);
      });
    }
  );
});
