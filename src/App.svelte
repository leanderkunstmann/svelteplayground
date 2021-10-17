<script lang="ts">

import "carbon-components-svelte/css/all.css";
import { afterUpdate, beforeUpdate} from 'svelte';
import "./services/i18n"
import { _ , init,  getLocaleFromNavigator} from 'svelte-i18n';
import {authenticated, darkMode, groups, groups_timestamp, language, theme, history} from "./stores";
import { Router, Route} from "svelte-navigator";

// init localstorage sync 

darkMode.useLocalStorage();
language.useLocalStorage();
history.useLocalStorage();
groups.useLocalStorage();
groups_timestamp.useLocalStorage();

// init auth
import PrivateRoute from "./PrivateRoute.svelte";
import {supabase} from "./supabaseClient"
let name:string

supabase.auth.onAuthStateChange((_, session) => {
	session ? authenticated.set(true) : authenticated.set(false)
})

function handleLogout() {
	supabase.auth.signOut()
	groups.set(null)
	groups_timestamp.set("")
}

// auth lifecycle

beforeUpdate(() => {
	if (!$authenticated){
		supabase.auth.session() ? authenticated.set(true) : authenticated.set(false)
	}
});

// store subscriptions

language.subscribe((value) => {
	if (!value){
	language.set(getLocaleFromNavigator())
}})

darkMode.subscribe ((value) => { 
	value ? theme.set("g100") : theme.set("g10");
})

theme.subscribe (()=> { 
document.documentElement.setAttribute('theme', $theme)
})

authenticated.subscribe((value)=>{
	name = value ? supabase.auth.user().email : "" ;
})

// init i18n 

init({
	fallbackLocale: 'en-US',
	initialLocale: $language,
});

const updateLanguage =(() => {
	language.set((<HTMLSelectElement>document.getElementById("language_selector")).value)
	init({
		fallbackLocale: 'en-US',
		initialLocale: $language,
	});
})

import {
Breakpoint,
Header,
HeaderUtilities,
HeaderAction,
HeaderPanelLinks,
HeaderPanelDivider,
HeaderPanelLink,
SkipToContent,
Content,
Grid,
HeaderNavItem,
HeaderNav,
Toggle,
Select, 
SelectItem 
} from "carbon-components-svelte";

// UI specific variables

let size:any;
let events:any = [];
let isOpen:boolean = false;


// routes

import Login from "./pages/Login.svelte";
import Home from "./pages/Home.svelte";
import Groups from "./pages/Groups.svelte";

// history


let history_array:string[] = $history
history_array.unshift(window.location.pathname)
if  (history_array.length > 2) {
	history_array.pop()
	}
history.set(history_array)



</script>


<Breakpoint bind:size on:match={(e) => (events = [...events, e.detail])} />
<Header platformName={$_("page_title")}>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <HeaderNav>

	<HeaderNavItem href="/" text={$_("home")} />
	<HeaderNavItem href="/about" text={$_("page_title")} />
	
	{#if $authenticated} <!-- PrivateRoutes -->
		<HeaderNavItem href="/groups" text="Groups" />
	{/if}

</HeaderNav>

  <HeaderUtilities>
	{#if $authenticated}
	<HeaderNav>
		<HeaderNavItem text="{name}"/>
	</HeaderNav>
	{/if}
    <HeaderAction bind:isOpen>
      <HeaderPanelLinks>

		{#if (size === "sm" || size === "md") &&  $authenticated}
			<HeaderPanelLink>{name}</HeaderPanelLink>
		{/if}

		{#if size === "sm" || size === "md"}
		<HeaderPanelDivider>Menu</HeaderPanelDivider>
		<HeaderPanelLink href="/">Home</HeaderPanelLink>
		<HeaderPanelLink href="/about">About</HeaderPanelLink>
			{#if $authenticated}
			<HeaderPanelLink href="/groups">Groups</HeaderPanelLink>
			{/if}
		{/if}


        <HeaderPanelDivider>{$_('settings')}</HeaderPanelDivider>


		{#if $authenticated}
			<HeaderPanelLink on:click={handleLogout}>Logout</HeaderPanelLink>
		{:else}
			<HeaderPanelLink href="/login">Login</HeaderPanelLink>
		{/if}
			<HeaderPanelLink>Dark Mode <Toggle toggled={$darkMode} on:toggle={() => darkMode.set(!$darkMode)} /></HeaderPanelLink>
			<br><br><br>	
			<HeaderPanelDivider>{$_('language')}</HeaderPanelDivider>
				<Select id="language_selector"  selected={$language} on:change={updateLanguage}>
					<SelectItem value="en-US" text={$_('english')} />
					<SelectItem value="de-DE" text={$_('german')} />

				  </Select>
			


      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>
</Header>



<Content>
  <Grid>
	<Router primary={false}>
		<main>
		  <Route path="login">
			<Login/>
		  </Route>
	  
		  <Route path="/">
			<Home />
		  </Route>

		  <Route path="sort">
		  </Route> 
	
		  <PrivateRoute path="profile" >
		  </PrivateRoute>

		  <PrivateRoute path="groups">
			<Groups />
		  </PrivateRoute>
		</main>
	  </Router>

  </Grid>



</Content>