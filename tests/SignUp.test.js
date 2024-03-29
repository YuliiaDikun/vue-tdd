import { mount } from "@vue/test-utils";
import SignUp from "../src/pages/SignUp.vue";
import Language from "../src/components/Language.vue";
import waitForExpect from "wait-for-expect";
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from "../src/locales/i18n";
import en from "../src/locales/en.json";
import uk from "../src/locales/uk.json";

let counter = 0;
let requestBody;
let acceptLanguageHeader;
const server = setupServer(
  rest.post("/api/1.0/users", (req, res, ctx) => {
    counter += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language");
    requestBody = req.body;
    return res(ctx.status(200));
  })
);

beforeAll(() => server.listen());
beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});
afterAll(() => server.close());

describe("Sign Up Page", () => {
  describe("layout", () => {
    const setup = () => {
      const wrapper = mount(SignUp, {
        global: {
          plugins: [i18n],
        },
      });
      return wrapper;
    };
    test("SignUp Component renders the correct text", () => {
      const wrapper = setup();
      expect(wrapper.find("h1").exists()).toBe(true);
    });

    test("inputs data-tests attributes", () => {
      const wrapper = setup();
      expect(wrapper.find('[data-test="username"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="email"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="password"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="password-repeat"]').exists()).toBe(true);
    });

    test("has password type for input", () => {
      const wrapper = setup();
      const inputLength = wrapper.findAll('[type="password"]').length;
      expect(inputLength).toBe(2);
    });

    test("SignUp Component renders the signup button", () => {
      const wrapper = setup();
      const signUpButton = wrapper.find("button");
      expect(signUpButton.exists()).toBe(true);
      expect(signUpButton.attributes("type")).toBe("submit");
    });

    test("signup button is disabled initially", () => {
      const wrapper = setup();
      const signUpButton = wrapper.find("button");
      expect(signUpButton.attributes().disabled).toBeDefined();
    });
  });
  describe("interactions", () => {
    let password;
    let passwordRepeatInput;
    let username;
    let email;

    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res.once(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };

    const setup = async () => {
      const wrapper = mount(SignUp, {
        global: {
          plugins: [i18n],
        },
      });
      username = wrapper.find('[data-test="username"]');
      email = wrapper.find('[data-test="email"]');
      password = wrapper.find('[data-test="password"]');
      passwordRepeatInput = wrapper.find('[data-test="password-repeat"]');

      await username.setValue("user1");
      await email.setValue("user1@mail.com");
      await password.setValue("password");
      await passwordRepeatInput.setValue("password");
      return wrapper;
    };

    test("enables the button when the password and password repeat fileds the same value", async () => {
      const wrapper = mount(SignUp, {
        global: {
          plugins: [i18n],
        },
      });
      const password = wrapper.find('[data-test="password"]');
      const passwordRepeatInput = wrapper.find('[data-test="password-repeat"]');
      const signUpButton = wrapper.find("button");

      await password.setValue("password");
      await passwordRepeatInput.setValue("password");

      expect(signUpButton.attributes("disabled")).toBeUndefined();
    });

    test("sends user data to backend after clicking the submit button", async () => {
      const wrapper = await setup();
      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");

      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "password",
      });
    });

    test("does not allow clicking to the button when in an ongoing api call", async () => {
      const wrapper = await setup();
      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");
      expect(signUpButton.attributes().disabled).toBeDefined();
      await signUpButton.trigger("click");

      expect(counter).toBe(1);
    });

    test("spinner is visible when in an ongoing api call", async () => {
      const wrapper = await setup();
      const button = wrapper.find("button");
      await button.trigger("click");
      const spinner = wrapper.find('[data-test="progress"]');

      expect(spinner.isVisible()).toBe(true);
    });

    test("spinner is hidden after in an ongoing api call", async () => {
      const wrapper = mount(SignUp, {
        global: {
          plugins: [i18n],
        },
      });
      const spin = wrapper.find('[data-test="progress"]');
      expect(spin.isVisible()).toBe(false);
    });

    test("does not display account activation message before sing up request", async () => {
      const wrapper = await setup();
      const message = wrapper.get("[data-test='signupSuccess']");
      expect(message.classes("hidden")).toBe(true);
    });

    test("displays account activation information after successful sing up request", async () => {
      const wrapper = await setup();

      const signUpButton = wrapper.find("button");

      await signUpButton.trigger("click");

      await waitForExpect(() => {
        const mess = wrapper.get("[data-test='signupSuccess']");
        expect(mess.classes("hidden")).toBe(false);
      });
    });

    test("does not display account activation message after failing sing up", async () => {
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res.once(ctx.status(400));
        })
      );
      const wrapper = await setup();

      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");

      await waitForExpect(() => {
        const message = wrapper.get("[data-test='signupSuccess']");
        expect(message.classes("hidden")).toBe(true);
      });
    });

    test.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"Email cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `("displays $message for $field", async (params) => {
      const { field, message } = params;

      server.use(generateValidationError(field, message));

      const wrapper = await setup();

      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");

      await waitForExpect(() => {
        const errorUsername = wrapper.find(`[data-test='error-${field}']`);
        expect(errorUsername.text()).toBe(message);
      });
    });

    test("hides spinner after error responce recieved", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );

      const wrapper = await setup();

      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");

      await waitForExpect(() => {
        wrapper.find("[data-test='error-name']");
        const spinn = wrapper.find('[data-test="progress"]');
        expect(spinn.isVisible()).toBe(false);
      });
    });

    test("enables the button after error responce received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );

      const wrapper = await setup();

      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");

      await waitForExpect(() => {
        wrapper.find("[data-test='error-name']");
        expect(signUpButton.attributes("disabled")).toBeUndefined();
      });
    });

    test("hides sign up form after successful sing up request", async () => {
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res.once(ctx.status(200));
        })
      );
      const wrapper = await setup();
      const signUpButton = wrapper.find("button");
      await signUpButton.trigger("click");

      await waitForExpect(() => {
        const form = wrapper.find("[data-test='form-sing-up']");
        expect(form.exists()).toBe(false);
      });
    });

    test("displays mismatch message for password repeat input", async () => {
      const wrapper = await setup();

      await password.setValue("P4ssword");
      await passwordRepeatInput.setValue("Password");

      await waitForExpect(() => {
        const text = wrapper.find("[data-test='error-password-repeat']");
        expect(text.exists()).toBe(true);
      });
    });

    test.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"Email cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `(
      "clear validation error after field $field  is updated",
      async (params) => {
        const { field, message } = params;
        server.use(generateValidationError(field, message));

        const wrapper = await setup();

        const signUpButton = wrapper.find("button");
        await signUpButton.trigger("click");

        await waitForExpect(async () => {
          const textError = wrapper.find(`[data-test='error-${field}']`);

          const fieldInput = wrapper.find(`[data-test='${field}']`);
          await fieldInput.setValue("newValue");
          expect(textError.exists()).toBe(false);
        });
      }
    );
  });
  describe("internationalization ", () => {
    let ukrainian;
    let english;
    let username;
    let email;
    let password;
    let passwordRepeat;
    let button;
    
    const setup = () => {
      const app = {
        components: {
          SignUp,
          Language,
        },
        template: `
        <SignUp />
        <Language/>
        `,
      };
      const wrapper = mount(app, {
        global: {
          plugins: [i18n],
        },
      });
      ukrainian = wrapper.find('[data-test="uk"]');
      english = wrapper.find('[data-test="en"]');
      username = wrapper.find("[data-test='username']");
      email = wrapper.find("[data-test='email']");
      password = wrapper.find("[data-test='password']");
      passwordRepeat = wrapper.find("[data-test='password-repeat']");
      button = wrapper.find("button");
      return wrapper;
    };    

    test("initially displays all text in English", () => {
      const wrapper = setup();
      const header = wrapper.find("h1");
      const button = wrapper.find("button");
      const usernameLabel = wrapper.find("[data-test='label-username']");
      const emailLabel = wrapper.find("[data-test='label-email']");
      const passwordLabel = wrapper.find("[data-test='label-password']");
      expect(header.text()).toBe(en.signUp);
      expect(button.text()).toBe(en.signUp);
      expect(usernameLabel.text()).toBe(en.username);
      expect(emailLabel.text()).toBe(en.email);
      expect(passwordLabel.text()).toBe(en.password);
    });

    test("displays all text in Ukrainian after selecting that language", async () => {
      const wrapper = setup();

      await ukrainian.trigger("click");

      waitForExpect(() => {
        const header = wrapper.find("h1");
        const button = wrapper.find("button");
        const usernameLabel = wrapper.find("[data-test='label-username']");
        const emailLabel = wrapper.find("[data-test='label-email']");
        const passwordLabel = wrapper.find("[data-test='label-password']");
        expect(header.text()).toBe(uk.signUp);
        expect(button.text()).toBe(uk.signUp);
        expect(usernameLabel.text()).toBe(uk.username);
        expect(emailLabel.text()).toBe(uk.email);
        expect(passwordLabel.text()).toBe(uk.password);
      });
    });

    test("displays all text in English after page is translated to Ukrainian", async () => {
      const wrapper = setup();

      await ukrainian.trigger("click");

      await english.trigger("click");

      waitForExpect(() => {
        const header = wrapper.find("h1");
        const button = wrapper.find("button");
        const usernameLabel = wrapper.find("[data-test='label-username']");
        const emailLabel = wrapper.find("[data-test='label-email']");
        const passwordLabel = wrapper.find("[data-test='label-password']");
        expect(header.text()).toBe(en.signUp);
        expect(button.text()).toBe(en.signUp);
        expect(usernameLabel.text()).toBe(en.username);
        expect(emailLabel.text()).toBe(en.email);
        expect(passwordLabel.text()).toBe(en.password);
      });
    });

    test(" displays password mismatch validation in Ukrainian", async () => {
      const wrapper = setup();

      await ukrainian.trigger("click");

      await password.setValue("P4ssword");
      await passwordRepeat.setValue("password");

      await waitForExpect(() => {
        const text = wrapper.find("[data-test='error-password-repeat']");
        expect(text.exists()).toBe(true);
        expect(text.text()).toBe(uk.passwordMismatch);
      });
    });

    test("sends accept-language having en to backend for sing up request", async () => {
      const wrapper = setup();    

      await username.setValue("user");
      await email.setValue("user@mail.com");
      await password.setValue("P4ssword");
      await passwordRepeat.setValue("P4ssword");
      await button.trigger('click');

      await waitForExpect(() => {
        const mess = wrapper.get("[data-test='signupSuccess']");
        expect(mess.classes("hidden")).toBe(false);

        expect(acceptLanguageHeader).toBe('en')
      });
    });

    test("sends accept-language having uk after that language is selected", async () => {
      const wrapper = setup(); 

      await ukrainian.trigger("click"); 

      await username.setValue("user");
      await email.setValue("user@mail.com");
      await password.setValue("P4ssword");
      await passwordRepeat.setValue("P4ssword");
      await button.trigger('click');

      await waitForExpect(() => {
        const mess = wrapper.get("[data-test='signupSuccess']");
        expect(mess.classes("hidden")).toBe(false);

        expect(acceptLanguageHeader).toBe('uk')
      });
    });
    test("displays account activation information in Ukrainian after selecting that language", async () => {
      const wrapper = setup();

      await ukrainian.trigger("click");

      await username.setValue("user");
      await email.setValue("user@mail.com");
      await password.setValue("P4ssword");
      await passwordRepeat.setValue("P4ssword");
      await button.trigger('click');

      await waitForExpect(() => {
        const mess = wrapper.get("[data-test='signupSuccess']");       
        expect(mess.text()).toBe(uk.emailCheck);        
      });
    });
  });
});
