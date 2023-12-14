import { mount, flushPromises, unmount } from "@vue/test-utils";
import SignUp from "../src/pages/SignUp.vue";

import { setupServer } from "msw/node";
import { rest } from "msw";

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

    test("enables the button when the password and password repeat fileds the same value", async () => {
      const passwordInput = wrapper.find('[data-test="password"]');
      const passwordRepeatInput = wrapper.find('[data-test="password-repeat"]');
      const signUpButton = wrapper.find("button");

      await passwordInput.setValue("password");
      await passwordRepeatInput.setValue("password");

      expect(signUpButton.attributes("disabled")).toBeUndefined();
    });

    test("sends user data to backend after clicking the submit button", async () => {
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res(ctx.status(200));
        })
      );

      server.listen();
      await setup();
      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");
      await server.resetHandlers()

      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "password",
      });
    
    });

    test("does not allow clicking to the button when in an ongoing api call", async () => {
      let counter = 0;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          counter += 1;
          return res(ctx.status(200));
        })
      );

      server.listen();
      const wrapper = mount(SignUp);  
      const userNameInput = wrapper.find('[data-test="username"]');
      const emailInput = wrapper.find('[data-test="email"]');
      const passwordInput = wrapper.find('[data-test="password"]');
      const passwordRepeatInput = wrapper.find('[data-test="password-repeat"]');
      const signUpButton = wrapper.find("button");
      
      await userNameInput.setValue("user1");
      await emailInput.setValue("user1@mail.com");
      await passwordInput.setValue("password");
      await passwordRepeatInput.setValue("password");

     
      await signUpButton.trigger("click");
      expect(signUpButton.attributes().disabled).toBeDefined();
      await signUpButton.trigger("click");
      await server.resetHandlers()
      expect(counter).toBe(1);
      wrapper.unmount()
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
      const spinner = wrapper.find('[data-test="progress"]');
      expect(spinner.isVisible()).toBe(false);
    });

    test("does not display account activation message before sing up request", async () => {
      const wrapper = mount(SignUp);
      const message = wrapper.get("[data-test='singUpSuccess']");
      expect(message.isVisible()).toBe(false);
    });

    test("displays account activation information after successful sing up request", async () => {     
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res(ctx.status(200));
        })
      );

      server.listen();
      await setup();
      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");
      await server.resetHandlers()

      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "password",
      });
    });

    test("does not display account activation message after failing sing up", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(400));
        })
      );

      server.listen();
      const wrapper = mount(SignUp);
      const userNameInput = wrapper.find('[data-test="username"]');
      const emailInput = wrapper.find('[data-test="email"]');
      const passwordInput = wrapper.find('[data-test="password"]');
      const passwordRepeatInput = wrapper.find('[data-test="password-repeat"]');
      const message = wrapper.get("[data-test='singUpSuccess']");

      await userNameInput.setValue("user1");
      await emailInput.setValue("user1@mail.com");
      await passwordInput.setValue("password");
      await passwordRepeatInput.setValue("password");
      const signUpButton = wrapper.find("button");

      await signUpButton.trigger("click");
      await server.close();

      await flushPromises();

      expect(message.isVisible()).toBe(false);
    });
    test("hides sign up form after successful sing up request", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );

      server.listen();
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
      await server.close();

      await flushPromises();

      const form = wrapper.find("[data-test='form-sing-up']");
      expect(form.exists()).toBe(false);
      wrapper.unmount()
    });
  });
});
