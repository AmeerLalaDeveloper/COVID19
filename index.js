let myChart=document.querySelector('.chart').getContext('2d');
let coronaURL='https://corona-api.com/countries '
let countriesURl="https://api.allorigins.win/raw?url=https://restcountries.herokuapp.com/api/v1"
let countriesFinal={},coronaStatsFinal={};
const continent={
    Americas:'Americas',
    Europe:'Europe',
    Africa:'Africa',
    Asia:'Asia',
    Oceania:'Oceania'
}
const countryFlagURL='https://www.countryflags.io/'//:country_code/:style/:size.png
const countryStatSection=document.querySelector('#country-stat')
const countryStatSectionContainer=document.createElement('div')
countryStatSectionContainer.classList.add('container')
let massPopChart;
let isScrolled=false;
const selectors=document.querySelectorAll('select')
const submit=document.querySelector('.submit')
const chart_section=document.querySelector('#chart-section')
const countriesDiv=document.querySelector('.countries')
let isURLRequested=false;
async function getCountriesAPI(){
    if(!window.localStorage.getItem('countries')){
       
        window.localStorage.setItem('countries',JSON.stringify(countries))
         }
    
}
async function getCoronaStatsAPI(){
if(!window.localStorage.getItem('coronaStats')&&!window.localStorage.getItem('countries')){
    const requestCorona=await (await fetch(coronaURL)).json();
    let coronaStats=requestCorona.data;
    const str=coronaStats.map(item=>{
        return{
            name:item.name,
            confirmed:item.latest_data.confirmed,
            critical:item.latest_data.critical,
            deaths:item.latest_data.deaths,
            recovered:item.latest_data.recovered,
            population:item.population,
            today:item.today,
            code:item.code
        }
    })
    window.localStorage.setItem('coronaStats',JSON.stringify(str))
}
}

window.onload=async ()=>{
await getCountriesAPI()
await getCoronaStatsAPI()
countriesFinal=getItemFromLocalStorage('countries')
coronaStatsFinal=getItemFromLocalStorage('coronaStats')
window.scrollTo(0,0)
}

function getItemFromLocalStorage(item){
return JSON.parse(localStorage.getItem(item))
}

function handleInputs(){
    const selectedContinent=selectors[0].value;
    const selectedChart=selectors[1].value;
    const selectedStatistic=selectors[2].value;
    buildChart(selectedContinent,selectedChart,selectedStatistic)
     buttonsListener();

}



submit.addEventListener('click',function(e){
    e.preventDefault()
     if(massPopChart)
        massPopChart.destroy();

     handleInputs();
     chart_section.scrollIntoView();
      document.body.style.overflow='auto'
    //  document.body.style.overflow='none'
   
    
})

function buildButtons(countriesNames,diffColors){
    for(let i=0;i<countriesNames.length;i++){
        let button=document.createElement('button')
        button.textContent=countriesNames[i];
        button.style.background=diffColors[i]
        button.classList.add('countryBtn')
        countriesDiv.appendChild(button)
    }
}
function getContinent(selectedContinent,statistic){
    let countriesNames=[],countriesStats=[]
    for(let i=0;i<countriesFinal.length;i++)
    {
       if(countriesFinal[i].region==selectedContinent)
        {    
            for(let j=0;j<coronaStatsFinal.length;j++)
            {
            if(coronaStatsFinal[j].name==countriesFinal[i].name&&coronaStatsFinal[j]!=undefined){
                 countriesStats.push(coronaStatsFinal[j][statistic])
                  countriesNames.push(countriesFinal[i].name); 
            } }
        } 
    }
return {countriesNames,countriesStats}
} 

function generateRandomColors(length){
    
    let arrayOfColors=[]
    for(let i=0;i<length-1;i++)
     arrayOfColors.push(`rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`)
    arrayOfColors.unshift('rgb(21,255,40)');
    return arrayOfColors;
}

function buildChart(selectedContinent,selectedChart,selectedStatistic){
 const continentData=getContinent(selectedContinent,selectedStatistic);   
    massPopChart= new Chart(myChart,{
    type:selectedChart,
    data:{

        labels:continentData.countriesNames,
        datasets:[{
            label:selectedStatistic,
            data:
           continentData.countriesStats
            ,
            backgroundColor:generateRandomColors(continentData.countriesNames.length)
            ,
            borderWidth:3,
            borderColor:'#777',
            tension:0.7
           
        }]
    },
    options:{
        maintainAspectRatio:false,
        fill:true,
         
        
    },
    scales:{
        size:20
    }
})
const diffColors=massPopChart.data.datasets[0].backgroundColor;
buildButtons(continentData.countriesNames,diffColors);
}
 function counrtyDataHandler(countryName){
   countryStatSectionContainer.innerHTML='';
   countryStatSection.innerHTML='';
   let country=coronaStatsFinal.find(val=>val.name==countryName);
   let div=document.createElement('div')
   div.classList.add('country-img')
   div.innerHTML=`<img src="https://www.countryflags.io/${country.code}/flat/64.png">`
   countryStatSectionContainer.innerHTML+=
    `
    
    <div class="countryInfo"><span class='title'>Country Name : </span><span class='result'>${country.name}</span></div>
    <div class="countryInfo"><span class='title'>New Cases :</span><span class='result'>${country.today.confirmed}</span></div>
    <div class="countryInfo"><span class='title'>Total Cases : </span><span class='result'>${country.confirmed}</span></div>
    <div class="countryInfo"><span class='title'>New Deaths : </span><span class='result'>${country.today.deaths}</span></div>
    <div class="countryInfo"><span class='title'>Total Deaths : </span><span class='result'>${country.deaths}</span></div>
    <div class="countryInfo"><span class='title'>Recovered :</span><span class='result'> ${country.recovered}</span></div>
    `
    countryStatSection.appendChild(div)
    countryStatSection.appendChild(countryStatSectionContainer)

 }
function buttonsListener(){
  const countriesButtons=document.querySelectorAll('.countryBtn')
  Array.from(countriesButtons).forEach(button=>{
      button.addEventListener('click',function(e){
        counrtyDataHandler(this.textContent)
        countryStatSection.scrollIntoView();
      })
  })
}



function setScroll(){
      
    if(document.body.lastChild.nodeName=='BUTTON')
        document.body.removeChild(document.body.lastChild)
    let scrollBtn={}
    isScrolled=true;
    scrollBtn=document.createElement('button')
    scrollBtn.classList.add('scroll-btn')
    scrollBtn.innerHTML= `ScrollUp <i class="fa fa-arrow-circle-up"></i>`
    document.body.appendChild(scrollBtn)
    scrollBtn.addEventListener('click',()=>{window.scrollTo(0,0)})
}
window.onscroll=()=>{
  if(window.scrollY>730)
         setScroll()
     
     else if(document.body.lastChild.nodeName=='BUTTON') {
           document.body.removeChild(document.body.lastChild)
     }
    }


