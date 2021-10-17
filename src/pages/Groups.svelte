<script>
import {supabase} from "../supabaseClient"
import {groups, groups_timestamp, createGroup, currency} from "../stores";

//init localstorage sync 
groups_timestamp.useLocalStorage();
groups.useLocalStorage();

let loading_select = false;
let loading = true;
let all_currencies

    import {
        FluidForm,
        TextInput,
        Button,
        DataTable,
        Toolbar,
        ToolbarContent,       
        Dropdown,
        InlineLoading,
        Loading
    } from "carbon-components-svelte";
  

async function GetData(string){
    let data = supabase.from(string).select()
  return data
}

async function getCurrency () {
                console.log("getting currencies ...")
                let datac = await GetData('currency');  
                let array = datac.body
                let newColumns = [];
                newColumns = array.map( item =>( { id: item.id, text: (item.code + ' / ' + item.name)} ))
  return newColumns
}


(async () => {
  let now =  (new Date().toISOString());
  if ($groups_timestamp < now)
  {
    groups_timestamp.set(new Date(Date.now() + (2 * 60 * 1000)));
    let data = await GetData('countries');
      groups.set(data.body)
      loading = false
  } 
  else{
    loading = false
  }
})();

createGroup.subscribe(async () => {
  if ($createGroup && !all_currencies){
    loading_select = true
    currency.set(await getCurrency())
    console.log($currency)
  }
})

currency.subscribe(async (value) => {
  if ($currency){
    all_currencies = value
    loading_select = false
  }
})


</script>  
{#if $createGroup}
<FluidForm>
  <TextInput  type="group_name" labelText="Group Name" placeholder="$_('enter-group-name')" required />
  <TextInput  type="email" labelText="E-Mail" placeholder="$_('enter-e-mail-of-a-member')" required />

  {#if !loading_select}
        <Dropdown
                      type="inline"
                      titleText="Currency"
                      selectedIndex={0}
                      items={all_currencies}
                    />       
        {:else}
        <InlineLoading description="loading_select data ..." />
        {/if}
<br/>
  <Button style="align: right"type="submit">$_('create-group')</Button>
</FluidForm>
<br/><br/>
<Button on:click={() => ($createGroup = !$createGroup)}>$_('go-back-to-group-overview')</Button>


{:else}
  {#if !loading}
        <DataTable
        title="Groups"
        description="Your organization's active load balancers."
        expandable
        size="tall"
        headers={[{ key: 'name', value: 'Name' }, { key: 'iso2', value: 'Owner' }, { key: 'iso3', value: 'Currency' }, { key: 'spendingcount', value: 'Count of Spendings' }]}
        rows={$groups}
      >
      <Toolbar>
        <ToolbarContent>
          <Button on:click={ async() => (createGroup.set(!$createGroup))}>$_('create-new-group')</Button>
        </ToolbarContent>
      </Toolbar>         
      <div slot="expanded-row" let:row>
        <pre>
          {JSON.stringify(row, null, 2)}
        </pre>
      </div>   
      </DataTable>
    {:else}
      <Loading />
    {/if}
{/if}