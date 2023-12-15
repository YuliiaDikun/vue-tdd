import { mount, flushPromises } from "@vue/test-utils";
import SignUp from "../src/pages/SignUp.vue";
import waitForExpect from "wait-for-expect";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { nextTick } from "vue";

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
      expect(signUpButton.attributes("type")).toBe("submit");
    });

    test("SingUp button is disabled initially", () => {
      const wrapper = mount(SignUp);
      const signUpButton = wrapper.find("button");
      expect(signUpButton.attributes().disabled).toBeDefined();
    });
  });
  describe("interactions", () => {
    const wrapper = mount(SignUp);
    const setup = async () => {
      const userNameInput = wrapper.find('[data-test="username"]');
      const emailInput = wrapper.find('[data-test="email"]');
      const passwordInput = wrapper.find('[data-test="password"]');
      const passwordRepeatInput = wrapper.find('[data-test="password-repeat"]');

      await userNameInput.setValue("user1");
      await emailInput.setValue("user1@mail.com");
      await passwordInput.setValue("password");
      await passwordRepeatInput.setValue("password");
    };
    let requestBody;
    let counter = 0;
    const server = setupServer(
      rest.post("/api/1.0/users", (req, res, ctx) => {
        counter += 1;
        requestBody = req.body;
        console.log("counter in request", counter);
        return res.once(ctx.status(200));
      })
    );

    beforeAll(() => server.listen());
    beforeEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test("enables the button when the password and password repeat fileds the same value", async () => {
      const passwordInput = wrapper.find('[data-test="password"]');
      const passwordRepeatInput = wrapper.find('[data-test="password-repeat"]');
      const signUpButton = wrapper.find("button");

      await passwordInput.setValue("password");
      await passwordRepeatInput.setValue("password");

      expect(signUpButton.attributes("disabled")).toBeUndefined();
    });

    test("sends user data to backend after clicking the submit button", async () => {
      await setup();
      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");

      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "password",
      });
    });

    test("does not allow clicking to the button when in an ongoing api call", async () => {
      await setup();
      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");
      await signUpButton.trigger("click");

      expect(counter).toBe(1);
    });

    test("spinner is visible when in an ongoing api call", async () => {
      await setup();
      const button = wrapper.find("button");
      await button.trigger("click");
      const spinner = wrapper.find('[data-test="progress"]');

      expect(spinner.isVisible()).toBe(true);
    });

    test("spinner is hidden after in an ongoing api call", async () => {
      const wrapper = mount(SignUp);
      const spin = wrapper.find('[data-test="progress"]');
      expect(spin.isVisible()).toBe(false);
    });

    test("does not display account activation message before sing up request", async () => {
      await setup();
      const message = wrapper.get("[data-test='singUpSuccess']");
      expect(message.classes("hidden")).toBe(true);
    });

    test("displays account activation information after successful sing up request", async () => {
      await setup();

      const signUpButton = wrapper.find("button");

      await signUpButton.trigger("click");
      
      await waitForExpect(() => {
        const mess = wrapper.get("[data-test='singUpSuccess']");
      expect(mess.classes("hidden")).toBe(false);
      })
      
    });

    test("does not display account activation message after failing sing up", async () => {
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(400));
        })
      );
      const wrapper = mount(SignUp);
      const userNameInput = wrapper.find('[data-test="username"]');
      const emailInput = wrapper.find('[data-test="email"]');
      const passwordInput = wrapper.find('[data-test="password"]');
      const passwordRepeatInput = wrapper.find('[data-test="password-repeat"]');

      await userNameInput.setValue("user1");
      await emailInput.setValue("user1@mail.com");
      await passwordInput.setValue("password");
      await passwordRepeatInput.setValue("password");

      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");

      await waitForExpect(() => {
        const message = wrapper.get("[data-test='singUpSuccess']");
        expect(message.classes("hidden")).toBe(true);
      });
    });
    test("hides sign up form after successful sing up request", async () => {
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );

      const wrapper = mount(SignUp);
      const userNameInput = wrapper.find('[data-test="username"]');
      const emailInput = wrapper.find('[data-test="email"]');
      const passwordInput = wrapper.find('[data-test="password"]');
      const passwordRepeatInput = wrapper.find('[data-test="password-repeat"]');

      await userNameInput.setValue("user1");
      await emailInput.setValue("user1@mail.com");
      await passwordInput.setValue("password");
      await passwordRepeatInput.setValue("password");

      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");

      await waitForExpect(() => {
        const form = wrapper.find("[data-test='form-sing-up']");
        expect(form.exists()).toBe(false);
      });
    });
  });
});
