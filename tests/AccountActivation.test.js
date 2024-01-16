import AccountActivationPage from "../src/pages/AccountActivationPage.vue";
import router from "../src/routes/router";
import i18n from "../src/locales/i18n";
import { mount } from "@vue/test-utils";
import waitForExpect from "wait-for-expect";
import { nextTick } from "vue";
import { flushPromises } from "@vue/test-utils";
import { setupServer } from "msw/node";
import { rest } from "msw";

let counter;

const serverAccount = setupServer(
  rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
    if (req.params.token === "5678") {
      return res(
        ctx.status(400),
        ctx.statusText( "Activation failure" )
      );
    } else {
      counter += 1;
      return res(ctx.status(200));
    }
  })
);
beforeAll(() => serverAccount.listen({
  onUnhandledRequest: 'error',
}));
beforeEach(() => {
  serverAccount.resetHandlers();
});
afterAll(() => serverAccount.close());

describe("Account Activation Page", () => {
  const setup = (token) => {
    const wrapper = mount(AccountActivationPage, {
      global: {
        plugins: [i18n, router],
        mocks: {
          $route: {
            params: {
              token: token,
            },
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

  test("displays failure message when token is incorect", async () => {
    const wrapper = setup("5678");

    waitForExpect(() => {
      const failureMessage = wrapper.find("[data-test='failure-activation']");
      expect(failureMessage.exists()).toBe(true);
    });
  });

  test("displays spinner during activation api call", async () => {
    const wrapper = setup("1234");    

    waitForExpect(() => {
      const spinner = wrapper.find("[data-test='spinner-status']");
      expect(spinner.exists()).toBe(true);

      const successMessage = wrapper.find("[data-test='success-activation']");
      expect(successMessage.exists()).toBe(true);

      expect(spinner.exists()).toBe(false);
    });
  });
});
