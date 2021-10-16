import { writable } from "svelte/store";

const createWritableStore = (key, startValue) => {
  const { subscribe, set } = writable(startValue);
  
  return {
    subscribe,
    set,
    useLocalStorage: () => {
      const json = localStorage.getItem(key);
      if (json) {
        set(JSON.parse(json));
      }
      
      subscribe(current => {
        localStorage.setItem(key, JSON.stringify(current));
      });
    }
  };
}

export const language = createWritableStore('language', null)

export const groups_timestamp = createWritableStore('groups_timestamp', null);

export const user = writable(null);

export const authenticated = writable(false)

export const darkMode = createWritableStore('darkMode', false)

export const theme = writable("g10")

export const path = writable(true);

export const groups = createWritableStore('groups', Object);

export const createGroup = writable(false);

export const currency = writable();

export const history:any = createWritableStore('history', ["/"]);




export const chart_data = writable();
export const show_chart = writable(false);
export const counter = writable(0);
