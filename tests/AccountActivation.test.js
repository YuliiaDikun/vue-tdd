import AccountActivationPage from "../src/pages/AccountActivationPage.vue";
import router from "../src/routes/router";
import i18n from "../src/locales/i18n";
import { mount } from "@vue/test-utils";
import waitForExpect from "wait-for-expect";
import { setupServer } from "msw/node";
import { rest } from "msw";

let counter;

const serverAccount = setupServer();
beforeAll(() => serverAccount.listen());
beforeEach(() => {
  counter = 0;
  serverAccount.resetHandlers();
  serverAccount.use(
    rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
      counter += 1;
      return res.once(ctx.status(200));
    })
  );
});
afterAll(() => serverAccount.close());

describe("Account Activation Page", () => {
  const setup = (token) => {
    const wrapper = mount(AccountActivationPage, {     
      global: {
        plugins: [i18n, router],
      },
        mocks: {
          $route: {
            params: {
              token: token,
            },
          },
        },
      
    });
    return wrapper;
  }; 
  
  test("displays activation success message when token is correct ", () => {
    const wrapper = setup("1234");

    waitForExpect(() => {
      const successMessage = wrapper.find("[data-test='success-activation']");
      expect(successMessage.exists()).toBe(true);
     
    });
  });

  test("sends activation request to backend", () => {
    const wrapper = setup("1234");

    waitForExpect(() => {
      const successMessage = wrapper.find("[data-test='success-activation']");
      expect(successMessage.exists()).toBe(true);
      expect(counter).toBe(1);
    });
  });
});
