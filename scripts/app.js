//Document data
const pkmnDataName = document.getElementById("pkmnDataName");
const pkmnDataDexNo = document.getElementById("pkmnDataDexNo");
const pkmnDataIcon = document.getElementById("pkmnDataIcon");
const pkmnDataAnimatedIcon = document.getElementById("pkmnDataAnimatedIcon");
const pkmnDataTypes = document.getElementById("pkmnDataTypes");
const pkmnDataCry = document.getElementById("pkmnDataCry");
const pkmnDataGeneral = document.getElementById("pkmnDataGeneral");
const pkmnDataEvolution = document.getElementById("pkmnDataEvolution");
const pkmnDataGame = document.getElementById("pkmnDataGame");
const pkmnSpecies = document.getElementById("pkmnSpecies");
const pkmnHeight = document.getElementById("pkmnHeight");
const pkmnWeight = document.getElementById("pkmnWeight");
const pkmnDexEntry = document.getElementById("pkmnDexEntry");
const cryBtn = document.getElementById("cryBtn");
const shinyBtn = document.getElementById("shinyBtn");
const searchBtn = document.getElementById("searchBtn");
const searchText = document.getElementById("searchText");
const btnGeneral = document.getElementById("btnGeneral");
const btnEvolution = document.getElementById("btnEvolution");
const btnGameData = document.getElementById("btnGameData");

//Declarations
let pkmnName = Math.ceil(Math.random() * 649);
let pkmnData = [];
let speciesData = [];
let evolutionData = [];
let basicPokemon = [];
let movesData = [];
let shinyToggle = false;


//fetches
//General Pokemon Data
async function getDataGeneral(nameId)
{
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameId}/`);
    const data = promise.json();
    return data;
}

//Extra Data
async function getExtraData(path)
{
    const promise = await fetch(path);
    const data = promise.json();
    return data;
}

//General Functions
function capitalize(s)
{
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
}

//Test Data gather
async function SearchPokemon(pkmnSearch)
{
    let prevData = pkmnData 
    
    //Basic Pokemon Data
    pkmnData = await getDataGeneral(pkmnSearch);
    console.log("Pokemon Data:\n", pkmnData);
    
    //Check to see if the pokemon is outside the asking range (cannot be a pokemon gen VI or higher)
    console.log("DexNo.", pkmnData.id);
    if (pkmnData.id > 649)
    {
        console.log("This Pokemon is invalid!");
        pkmnData = prevData;
        return null;
    }
    pkmnDataDexNo.innerText = "National Dex No. " + pkmnData.id;

    console.log("Name:", capitalize(pkmnData.name));
    let pkmnNameReturn = "";
    for (let i = 0; i < pkmnData.name.length; i++)
    {
        if (pkmnData.name[i] == "-")
        {
            break;
        }
        pkmnNameReturn += pkmnData.name[i]
    }
    pkmnDataName.innerText = capitalize(pkmnNameReturn);


    console.log("Height:", (pkmnData.height/10).toFixed(1),"m");
    pkmnHeight.innerText = "Height: "+ (pkmnData.height/10).toFixed(1)+" m";
    console.log("Weight:", (pkmnData.weight/10).toFixed(1),"kg");
    pkmnWeight.innerText = "Weight: "+ (pkmnData.weight/10).toFixed(1)+" kg";

    pkmnDataTypes.innerHTML = "";
    pkmnData.types.map(type => {
        console.log("Type:", type);

        let h1 = document.createElement('h1');
        h1.className = `col-start-${type.slot} border-opacity-50 px-2 bg-slate-300 border-4 border-slate-400 rounded-xl type-${type.type.name}`;
        if (pkmnData.types.length == 1)
        {
            h1.className += ` col-span-2`;
        }
        h1.innerText = type.type.name.toUpperCase();
        
        pkmnDataTypes.appendChild(h1);
    });

    pkmnDataCry.src = pkmnData.cries.latest;

    pkmnDataIcon.src = pkmnData.sprites.other["official-artwork"].front_default;
    pkmnDataIcon.alt = capitalize(pkmnData.name)+"OfficialArtwork";

    pkmnDataAnimatedIcon.src = pkmnData.sprites.other.showdown.front_default;
    pkmnDataIcon.alt = capitalize(pkmnData.name)+"ShowdownIcon";
    
    //Spawn Data
    locationData = await getExtraData(pkmnData.location_area_encounters);
    console.log("Location Data\n", locationData.length < 1 ? null : locationData);
    
    //Species Data for the Pokemon
    speciesData = await getExtraData(pkmnData.species.url);
    console.log("Species Data\n", speciesData);

    //Pokedex Entry 
    for (let i = 0; i < speciesData.flavor_text_entries.length; i++)
    {
        //Here we look for the English entry of the pokemon from Pokemon X. We break in order to generate only 1 dex entry.
        if (speciesData.flavor_text_entries[i].language.name === "en" && speciesData.flavor_text_entries[i].version.name === "x")
        {
            console.log("Dex Entry:\n",speciesData.flavor_text_entries[i].flavor_text);
            pkmnDexEntry.innerText = speciesData.flavor_text_entries[i].flavor_text;
            break;
        }
        
    }

    for (let i = 0; i < speciesData.genera.length; i++)
    {
        if (speciesData.genera[i].language.name == "en")
        {
            pkmnSpecies.innerText = speciesData.genera[i].genus
            break;
        }
    }

    //Searching for Evo Data
    evolutionData = await getExtraData(speciesData.evolution_chain.url);
    console.log("Evolution Data:\n", evolutionData);

    //Data for the first pokemon in the evo line
    basicPokemon = await getExtraData(evolutionData.chain.species.url);
    console.log("Basic Pokemon:\n", basicPokemon);

    //New Evo Data to get a ladder leading up to and including pokemon in the evo line
    evolutionData = await getExtraData(basicPokemon.evolution_chain.url);
    console.log("Evolution Data:\n", evolutionData);

    //Move Data
    for (let i = 0; i < pkmnData.moves.length; i++)
    {
        movesData.push(pkmnData.moves[i].move.name);
    }
    console.log("Moves Data:\n", movesData);
}


SearchPokemon(pkmnName);

//Event listener for searching basaed on input
searchBtn.addEventListener('click', function()
{
    SearchPokemon(searchText.value.toLowerCase());
})

//Event listener for pokemon cries
cryBtn.addEventListener('click', function()
{
   
    
    //#1 3DS Pikachu Cry Hater. Thank goodness they changed it in Legends and Scarlet/Violet.
    if (pkmnData.id == 25)
        {
            pkmnDataCry.src = pkmnData.cries.legacy;
        } 
        
    pkmnDataCry.volume = 0.2;
    pkmnDataCry.play();
})

//Event listener for toggling shiny icons
shinyBtn.addEventListener('click', function()
{
    shinyToggle = !shinyToggle;
    if (shinyToggle)
    {
        pkmnDataIcon.src = pkmnData.sprites.other["official-artwork"].front_shiny;
        pkmnDataAnimatedIcon.src = pkmnData.sprites.other.showdown.front_shiny;
    } else {
        pkmnDataIcon.src = pkmnData.sprites.other["official-artwork"].front_default;
        pkmnDataAnimatedIcon.src = pkmnData.sprites.other.showdown.front_default;
    }
})

btnGeneral.addEventListener('click',function()
{
    pkmnDataGeneral.style = "display: block";
    pkmnDataEvolution.style = "display: none";
    pkmnDataGame.style = "display: none";
})

btnEvolution.addEventListener('click',function()
{
    pkmnDataGeneral.style = "display: none";
    pkmnDataEvolution.style = "display: block";
    pkmnDataGame.style = "display: none";
})

btnGameData.addEventListener('click',function()
{
    pkmnDataGeneral.style = "display: none";
    pkmnDataEvolution.style = "display: none";
    pkmnDataGame.style = "display: block";
})


