<script >
import { Button } from 'carbon-components-svelte';



import { onMount } from 'svelte';
import { chart } from "svelte-apexcharts";
import {chart_data, show_chart, counter} from "../services/stores";

                    
function randomArray(length:number,range:number){
    let arr:Array<Number> =[...new Array(length)]
        .map(() => Math.round(Math.random() * range));
        console.log(arr)
    return arr
}


function timer(ms:number) { return new Promise(res => setTimeout(res, ms)); }

function createSeriesObject(name:string,dataset:Array<Number | string | number>){
    let series: object = {
        name: name,
        data: dataset
    }
    console.log(series)
    return series
}

function modifyDataset(type:string,series:object) {
let options = {
    chart: {
      type:  type,
    },
    series: [series]
  };
  console.log(options)
return options
}


const bubbleSort = async () => {
    let array = dataset.series[0].data
    for(let i = 0; i < array.length; i++) {
        
        for(let j = 0; j < array.length - 1; j++) {
            counter.update(n => n+1)
            if(array[j] > array[j + 1]) {
                let swap = array[j];
                array[j] = array[j + 1];
                array[j + 1] = swap;
            }
            else {
                chart_data.set(modifyDataset(dataset.chart.type,createSeriesObject(dataset.series[0].name, array)))
                await timer(1)
            }
        }
    }
}

const mergeSort = async () => {
    console.log("started")
let array = dataset.series[0].data
const divide = (array:Array<Number>) => {
    let halfLength:number = Math.ceil(array.length / 2);
    let low:any = array.slice(0, halfLength);
    let high:any = array.slice(halfLength);
    if (halfLength > 1) {
        low = divide(low);
        high = divide(high);
    }

    return combine(low, high);
}
const combine = async (low: Array<Number>, high: Array<Number>) => {
    let indexLow = 0;
    let indexHigh = 0;
    let lengthLow = low.length;
    let lengthHigh = high.length;
    let combined:Array<Number> = [];
    while (indexLow < lengthLow || indexHigh < lengthHigh) {
        counter.update(n => n+1)
        let lowItem = low[indexLow];
        let highItem = high[indexHigh];
        if (lowItem !== undefined) {
            if (highItem === undefined) {
                combined.push(lowItem);
                indexLow++;
            } else {
                if (lowItem <= highItem) {
                    combined.push(lowItem);
                    indexLow++;
                } else {
                    combined.push(highItem);
                    indexHigh++;
                }
            }
        } else {
            if (highItem !== undefined) {
                combined.push(highItem);
                indexHigh++;

            }
        }
    }
    return combined;
}
chart_data.set(modifyDataset(dataset.chart.type,createSeriesObject(dataset.series[0].name, array)))
}



    let dataset = {
                    chart: {
                        type: "",
                            },
                    series: [
                    {
                        name: "",
                        data: [],
                    }
                    ]
                };


(async () => {
chart_data.set(await modifyDataset("bar",createSeriesObject("dataset", randomArray(20, 422))))
})();

    show_chart.set(false)
     chart_data.subscribe((value) => {
         if(value)
         show_chart = true
         dataset = value
        })




console.log($chart_data)
</script>

{#if show_chart}
<div use:chart={dataset} />
<button  on:click|once={bubbleSort}>$_('sort')</button>
<button  on:click|once={mergeSort}>$_('sort-0')</button> 
<p>{$counter}</p>
{:else}
<!-- this block renders when photos.length === 0 -->
<p>loading...</p>
{/if}
