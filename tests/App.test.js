import { mount } from "@vue/test-utils";
import App from "../src/App.vue";
import i18n from "../src/locales/i18n";
import router from "../src/routes/router";
import waitForExpect from "wait-for-expect";
import { setupServer } from "msw/node";
import { rest } from "msw";

const serverAccount = setupServer(rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
  counter += 1;
  return res.once(ctx.status(200));
}));

beforeAll(() => serverAccount.listen());

beforeEach(() => { 
  serverAccount.resetHandlers(); 
});
afterAll(() => serverAccount.close());



const setup = async (path) => {
  router.replace(path);
  await router.isReady();
  const wrapper = mount(App, {
    global: {
      plugins: [i18n, router],
    },
  });  
 
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
    const wrapper = setup(path);

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

    const wrapper = setup(path);

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
    const wrapper = setup("/");
    waitForExpect(() => {
      const homeLink = wrapper.find(`[data-test='${targetPage}Link']`);
      expect(homeLink.exists()).toBe(true);
    });
  });

  test.each`
    initialPath  | clickingTo  | visiblePage
    ${"/"}       | ${"signup"} | ${"signup"}
    ${"/signup"} | ${"home"}   | ${"homepage"}
    ${"/"}       | ${"login"}  | ${"login"}
  `(
    "displays $visiblePage page after clicking $clickingTo link at $initialPath page",
    async (params) => {
      const { initialPath, clickingTo, visiblePage } = params;
      const wrapper = await setup(initialPath);
      const link =  wrapper.find(`[data-test='${clickingTo}Link']`);
    
      await link.trigger("click");
          
      waitForExpect(async () => {
        const page = wrapper.find(`[data-test='${visiblePage}']`);  
        expect(page.exists()).toBe(true);
      });
    }
  );
});
