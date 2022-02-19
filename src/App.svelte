<script lang="ts">

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
		SelectItem,
		Tile
	} from "carbon-components-svelte";

	import "carbon-components-svelte/css/all.css";
	import {beforeUpdate} from 'svelte';
	import "./services/i18n.ts"
	import { _ , init,  getLocaleFromNavigator} from 'svelte-i18n';
	import {authenticated, darkMode, groups, reload_gr, language, theme, history} from "./services/stores";
	import { Router, Route} from "svelte-navigator";
	import PrivateRoute from "./routing/PrivateRouteWrapper.svelte";
	import {supabase} from "./auth/supabaseClient"

	// ROUTING

	// --> mainRoute, Landing-/Homepage

	import Home from "./pages/public/Home.svelte";

	// ---> publicRoutes, accessible for everyone

	import Login from "./pages/public/Login.svelte";

	const publicRoutes = [
		{ id: Login},
	];

	// ---> privateRoutes, accessible for authenticated Users

	import Groups from "./pages/private/Groups.svelte";
	import Storage from "./pages/private/Storage.svelte";

	const privateRoutes = [
		{ id: Groups},
		{ id: Storage},
	];


	// init localstorage sync
	darkMode.useLocalStorage();
	language.useLocalStorage();
	history.useLocalStorage();
	groups.useLocalStorage();
	reload_gr.useLocalStorage();

	// UI specific variables
	let size:string;
	let events:Array<any> = [];
	let isOpen:boolean = false;
	let user_identifier:string

	supabase.auth.onAuthStateChange((_, session) => {
		session ? authenticated.set(true) : authenticated.set(false)
	})

	function handleLogout() {
		supabase.auth.signOut()
		groups.set(null)
		reload_gr.set("")
	}

	// auth lifecycle
	beforeUpdate(() => {
		if (!$authenticated){
			supabase.auth.session() ? authenticated.set(true) : authenticated.set(false)
			if ($groups === undefined) {groups.set(null)}
		}
	});

	// store subscriptions

	language.subscribe((value) => {
		if (!value){
			language.set(getLocaleFromNavigator())
		}
	})

	darkMode.subscribe ((value) => {
		value ? theme.set("g100") : theme.set("g10");
	})

	theme.subscribe (()=> {
		document.documentElement.setAttribute('theme', $theme)
	})

	authenticated.subscribe((value)=>{
		user_identifier = value ? supabase.auth.user()!.email  : "" ;
	})

	// init i18n
	//todo: keine Ahnung warum Intellj hier meckert, geht einwandfrei, hatte noch keine Lust mich hiermit zu beschäftigen

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

	// history

	let history_array:string[] = $history

	history_array.unshift(window.location.pathname)

	if (history_array.length > 2) {
		history_array.pop()
	}

	history.set(history_array)

</script>


<Breakpoint bind:size on:match={(e) => (events = [...events, e.detail])} />

<Header platformName={$_("HOME.page_title")}>
	<div slot="skip-to-content">
		<SkipToContent />
	</div>

	<HeaderNav>
		<HeaderNavItem href="/" text={$_("HOME.home")} />
		{#each publicRoutes as route}
			<HeaderNavItem href={route.id.toString().split(" ")[1].toLowerCase()} text={$_("HOME."+ route.id.toString().split(" ")[1].toLowerCase() )}/>
		{/each}

		{#if $authenticated} <!-- PrivateRoutes -->
			{#each privateRoutes as route}
				<HeaderNavItem href={route.id.toString().split(" ")[1].toLowerCase()} text={$_("HOME."+ route.id.toString().split(" ")[1].toLowerCase() )}/>
			{/each}
		{/if}
	</HeaderNav>

	<HeaderUtilities>
		{#if $authenticated}
			<HeaderNav>
				<HeaderNavItem text="{user_identifier}"/>
			</HeaderNav>
		{/if}

		<HeaderAction bind:isOpen>
		  <HeaderPanelLinks>

			{#if (size === "sm" || size === "md") &&  $authenticated}
				<HeaderPanelLink>{user_identifier}</HeaderPanelLink>
			{/if}

			{#if size === "sm" || size === "md"}
				<HeaderPanelDivider>Menu</HeaderPanelDivider>
				<HeaderPanelLink href="/">Home</HeaderPanelLink>
				<HeaderPanelLink href="/about">About</HeaderPanelLink>
				{#if $authenticated}
					<HeaderPanelLink href="/groups">Groups</HeaderPanelLink>
				{/if}
			{/if}

			<HeaderPanelDivider>{$_('HOME.settings')}</HeaderPanelDivider>

			{#if $authenticated}
				<HeaderPanelLink on:click={handleLogout}>Logout</HeaderPanelLink>
			{:else}
				<HeaderPanelLink href="/login">Login</HeaderPanelLink>
			{/if}
			<HeaderPanelLink>Dark Mode <Toggle toggled={$darkMode} on:toggle={() => darkMode.set(!$darkMode)} /></HeaderPanelLink>
			<br><br><br>
			<HeaderPanelDivider>{$_('HOME.language')}</HeaderPanelDivider>
				<Select   id="language_selector"  selected={$language} on:change={updateLanguage}>
					<SelectItem value="en-US" text={$_('HOME.english')} />
					<SelectItem value="de-DE" text={$_('HOME.german')} />
				</Select>

		  </HeaderPanelLinks>
		</HeaderAction>
	  </HeaderUtilities>
</Header>


<Content>
  <Grid>
	<Router primary={false}>
		<main>
			<Route path="/">
				<Home />
			</Route>

			<!--Wrapper for publicRoutes-->
			{#each publicRoutes as route}
				<Route path={route.id.toString().split(" ")[1].toLowerCase()}>
					<Tile>
						<svelte:component this={route.id}/>
					</Tile>
				</Route>
			{/each}

			<!--Wrapper for privateRoutes-->
			{#each privateRoutes as route}
				<PrivateRoute path={route.id.toString().split(" ")[1].toLowerCase()}>
					<Tile>
						<svelte:component this={route.id}/>
					</Tile>
				</PrivateRoute>
			{/each}

		</main>
	  </Router>
  </Grid>
</Content>