<script lang="ts">
    import { useNavigate, useLocation } from "svelte-navigator";
    import { authenticated} from "../services/stores";
  
    const navigate = useNavigate();
    const location = useLocation();
  
    $: if (!$authenticated) {
      navigate("/login", {
        state: { from: $location.pathname },
        replace: true,
      });
    }
  </script>
  
  {#if $authenticated}
    <slot />
  {/if}
  