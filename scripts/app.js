//Document data
const pkmnDataName = document.getElementById("pkmnDataName");
const pkmnDataDexNo = document.getElementById("pkmnDataDexNo");
const pkmnDataIcon = document.getElementById("pkmnDataIcon");
const pkmnDataTypes = document.getElementById("pkmnDataTypes");
const pkmnDataCry = document.getElementById("pkmnDataCry");
const cryBtn = document.getElementById("cryBtn");
const searchBtn = document.getElementById("searchBtn")


//Declarations
let pkmnName = Math.ceil(Math.random() * 649);
let pkmnData = [];
let speciesData = [];
let evolutionData = [];
let basicPokemon = [];
let movesData = [];


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
    //Basic Pokemon Data
    pkmnData = await getDataGeneral(pkmnSearch);
    console.log("Pokemon Data:\n", pkmnData);

    console.log("Name:", capitalize(pkmnData.name));
    pkmnDataName.innerText = capitalize(pkmnData.name);

    console.log("DexNo.", pkmnData.id);
    pkmnDataDexNo.innerText = "National Dex No. " + pkmnData.id;

    console.log("Height:", (pkmnData.height/10).toFixed(1),"m");
    console.log("Weight:", (pkmnData.weight/10).toFixed(1),"kg");

    // console.log("Type 1:", capitalize(pkmnData.types[0].type.name));
    // console.log("Type 2:", pkmnData.types.length < 2 ? null : capitalize(pkmnData.types[1].type.name));
    function TypeList()
    {
        
        pkmnData.types.map(type => {
            console.log("Type:", type);

            let h1 = document.createElement('h1');
            h1.className = `col-start-${type.slot} px-2 bg-slate-300 border-4 border-slate-400 rounded-xl`;
            h1.innerText = type.type.name.toUpperCase();
            console.log(h1);
            
            pkmnDataTypes.appendChild(h1);
        });
        
    }

    TypeList();

    pkmnDataIcon.src = pkmnData.sprites.other["official-artwork"].front_default;
    pkmnDataIcon.alt = capitalize(pkmnData.name)+"OfficialArtwork";
    
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
searchBtn.addEventListener

//Event listener for pokemon cries
cryBtn.addEventListener('click', function()
{
    pkmnDataCry.src = pkmnData.cries.latest;
    
    //#1 3DS Pikachu Cry Hater. Thank goodness they changed it in Legends and Scarlet/Violet.
    if (pkmnData.id == 25)
        {
            pkmnDataCry.src = pkmnData.cries.legacy;
        } 
        
    pkmnDataCry.volume = 0.2;
    pkmnDataCry.play();
})
