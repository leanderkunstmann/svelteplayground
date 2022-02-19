<script>
    import Particles from "svelte-particles";
    import { fly } from 'svelte/transition';
    import { _ } from 'svelte-i18n';
    import {darkMode, theme} from "../../services/stores";

    const color_light = "#000";

    const color_dark = "#fff";

    let options;
    let glow_colour;

    darkMode.subscribe ((value) => {
        options = getOptions(value);
        value
            ? document.documentElement.style
                .setProperty('--glow-colour', color_dark)
            :  document.documentElement.style
                .setProperty('--glow-colour', color_light)
    })

    function getOptions(darkMode){
        return {
            fpsLimit: 30,
            particles: {
                number: {
                    value: 125,
                    density: {
                        enable: true,
                        area: 1000,
                    },
                },
                color: {
                    value: [darkMode ?  color_dark : color_light]
                },
                opacity: {
                    value: 0.5,
                    random: true,
                },
                size: {
                    value: 3,
                    random: true,
                },
                move: {
                    enable: true,
                    speed: 4,
                    random: true,
                },
            },
        };
    }


</script>

<div class="wrapper">
    <img src="tree.png" alt="tree"/>
    <Particles
            id="background"
            options="{options}"
    />

<p class="centered" transition:fly="{{ y: 150, duration: 5000 }}">
    {$_('HOME.Welcome')}
</p>
</div>
<style>

    :root {
        --glow-colour: #fff;
    }

    img {
        width: auto;
        height: 100%;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
        -webkit-user-drag: none;
        -webkit-filter: drop-shadow(5px 5px 50px var(--glow-colour));
        filter: drop-shadow(5px 5px 50px var(--glow-colour));
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }

    .centered {
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%,-50%);
    }

    p {
        position: absolute;
        transform: translate(-50%,-50%);
        font-size:calc(100% + 4vw);
        color: #fff;
        backdrop-filter:  blur(5px) saturate(200%);
    }
</style>
