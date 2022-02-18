<script>

import {supabase} from "../auth/supabaseClient"
import { onMount } from 'svelte';

import { RecursiveList,TreeView } from "carbon-components-svelte";
import {children_store} from "../services/stores";

let loading = true;

const rootpath = '';
const bucket = 'svelte-public';

let path_array = [];
let id = 0

async function getFolderRecursive (bucket, path)
{
    let response;
    const res = await supabase
    .storage
    .from(bucket)
    .list(path)
    
    for (let i = 0; i < res.data.length; i++) 
    {
       const rec = async (item) => {
                        if (item.name.indexOf('.') === -1) 
                            {
                                let recursive_path = path === '' ? item.name : path + '/' + item.name
                                console.log(recursive_path)
                                return await getFolderRecursive (bucket, recursive_path)
                            }
                        else{
                            return []
                        }
       } 
        
       const response = res.data.map(async function(item){
           if(item.name !== '.emptyFolderPlaceholder')
           {
               path_array.push(path)
            return {
                    id: id++, 
                    text: item.name,
                    children: await rec(item)
                }
            }
            else { return []}
        });
        return await Promise.all(response)
    }
    return response
}

onMount(async () => {

let current_bucket = await getFolderRecursive (bucket, rootpath)
console.log(current_bucket)
children_store.set(current_bucket)

loading = false
});

const downloadFiles = async (e) => {
    let download_path = path_array[e.detail.id]
    let downPath = download_path === '' ? e.detail.text : download_path + '/' + e.detail.text;
 const { data, error } = await supabase
  .storage
   .from(bucket)
   .download(downPath)

   var anchor = angular.element('<a/>');
     anchor.attr({
         href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
         target: '_blank',
         download: e.detai
     })[0].click();

}

</script>
{#if !loading}

<TreeView
  labelText="Your files"
  children={$children_store}
  on:toggle={async (e) => {await downloadFiles(e)}}
/> 

{/if}
