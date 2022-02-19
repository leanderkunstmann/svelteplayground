<script lang="ts">

  import {
    Form,
    TextInput,
    PasswordInput,
    Button,
    Tabs, Tab, TabContent
  } from "carbon-components-svelte";

  import { _ } from 'svelte-i18n';
  import {history, authenticated} from "../../services/stores";
  import {supabase} from "../../auth/supabaseClient"
  import { useNavigate, useLocation } from "svelte-navigator";

  let loading:boolean = false
  let email:string;
  let password:string;


  let invalid_login_mail:boolean;
  let invalid_login_magic:boolean;
  let invalid_sign_up:boolean;

  const navigate = useNavigate();
  const location = useLocation();

  //handle redirect if logged in
  if($authenticated) {
    navigate('/', {
      state: {from: $location.pathname},
      replace: true,
    })
  }

  const handleLoginEmailPassword = async (event) => {
    try {
      event.preventDefault();
      loading = true
      const { error } = await supabase.auth.signIn({ email, password })
      if (error) throw error
      navigate($history[1], {
        state: { from: $location.pathname },
        replace: true,
      });
    }
    catch (error) {
      invalid_login_mail= true
    }
    finally {
      loading = false
      return loading
    }
  }

  const handleLoginMagicLink = async (event) => {
    try {
      event.preventDefault();
      loading = true
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    }
    catch (error) {
      invalid_login_magic= true
    }
    finally {
      loading = false
      return loading
    }
  }


  const handleSignUp = async (event) => {
    try {
      event.preventDefault();
      loading = true
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      alert('bestäigen bitte')
    }
    catch (error) {
      invalid_sign_up= true
    }
    finally {
      loading = false
      return loading
    }
  }

</script>
  <Tabs type="container">
    <Tab label={$_('LOGIN.Tab.LoginMail')} />
    <Tab label={$_('LOGIN.Tab.LoginMagic')} />
    <Tab label={$_('LOGIN.Tab.SignUp')} />
    <div slot="content">
      <TabContent>
        <Form on:submit={handleLoginEmailPassword}>
          <TextInput  type="email"  bind:value={email} labelText="E-Mail" placeholder="Enter E-Mail..." required />
          <br>
          <PasswordInput
            required
            bind:value={password}
            type="password"
            labelText="Password"
            placeholder="Enter password..."
            invalid={invalid_login_mail}
            invalidText="Incorrect user name or password."
          />
          <br><br>
          <Button type="submit">Sign In</Button>
        </Form>
      </TabContent>
      <TabContent>
        <Form on:submit={handleLoginMagicLink}>
          <TextInput  type="email"  bind:value={email} labelText="E-Mail" placeholder="Enter E-Mail..." required />
          <br><br>
          <Button type="submit">Sign up</Button>
        </Form>
      </TabContent>

      <TabContent>
        <Form on:submit={handleSignUp}>
          <TextInput  type="email"  bind:value={email} labelText="E-Mail" placeholder="Enter E-Mail..." required />
          <PasswordInput
            required
            type="password"
            bind:value={password}
            labelText="Password"
            placeholder="Enter password..."
          />
          <PasswordInput
            required
            type="password"
            labelText="Password again"
            placeholder="Enter password again..."
          />
          <br><br>
        <Button type="submit">Sign up</Button>
        </Form>
      </TabContent>
    </div>
  </Tabs>