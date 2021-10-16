<script>

  import {
    FluidForm,
    TextInput,
    PasswordInput,
    Button,
    Tabs, Tab, TabContent
  } from "carbon-components-svelte";

  import {history, authenticated} from "../stores";


  let loading = false
  let email;
  let password;
	import {supabase} from "../supabaseClient"
  import { useNavigate, useLocation } from "svelte-navigator";
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginMagicLink = async () => {
    try {
      loading = true
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      loading = false
    }
  }

  const handleLoginEmailPassword = async () => {
    try {
      loading = true
      const { error } = await supabase.auth.signIn({ email, password })
      if (error) throw error
      navigate($history[1], {
        state: { from: $location.pathname },
        replace: true,
      });
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      loading = false
    }
  }
 //todo: handle login previous link and maybe create function with parameters to lessen code
  const handleSignUp = async () => {
    try {
      loading = true
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      alert('bestäigen bitte')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      loading = false
    }
  }


</script>

<Tabs type="container">
  <Tab label="Login" />
  <Tab label="Registration" />
  <div slot="content">
    <TabContent>
      <FluidForm on:submit={handleLoginEmailPassword}>
        <TextInput  type="email"  bind:value={email} labelText="E-Mail" placeholder="Enter E-Mail..." required />
        <PasswordInput
          required
          bind:value={password}
          type="password"
          labelText="Password"
          placeholder="Enter password..."
        />
        <Button type="submit">Sign In</Button>
      </FluidForm>
    </TabContent>


    <TabContent>
      <FluidForm on:submit={handleSignUp}>
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
      <Button type="submit">Sign up</Button>
      </FluidForm>
    </TabContent>
  </div>
</Tabs>