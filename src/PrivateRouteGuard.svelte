<script lang="ts">
    import { useNavigate, useLocation } from "svelte-navigator";
    import { authenticated} from "./stores";
  
    const navigate = useNavigate();
    const location = useLocation();

    console.log("check if auth  " + $authenticated)
  
    $: if (!$authenticated) {
      console.log("check if auth  " + $authenticated)
      navigate("/login", {
        state: { from: $location.pathname },
        replace: true,
      });
    }
  </script>
  
  {#if $authenticated}
    <slot />
  {/if}
  