//Document data
const cryAudio = document.getElementById("cryAudio");

//Declarations
let pkmnData = [];
let speciesData = [];
let evolutionData = [];
let basicPokemon = [];
let movesData = [];


//fetches
//General Pokemon Data
async function getDataGeneral(pkmnName)
{
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmnName}/`);
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
async function test()
{
    //Basic Pokemon Data
    pkmnData = await getDataGeneral("Chandelure");
    console.log("Pokemon Data:\n", pkmnData);
    console.log("Name:", capitalize(pkmnData.name));
    console.log("DexNo.", pkmnData.id);
    console.log("Height:", (pkmnData.height/10).toFixed(1),"m");
    console.log("Weight:", (pkmnData.weight/10).toFixed(1),"kg");
    console.log("Type 1:", capitalize(pkmnData.types[0].type.name));
    console.log("Type 2:", pkmnData.types.length < 2 ? null : capitalize(pkmnData.types[1].type.name));

    //Spawn Data
    locationData = await getExtraData(pkmnData.location_area_encounters);
    console.log("Location Data\n", locationData.length < 1 ? null : locationData);
    
    //Species Data for the Pokemon
    speciesData = await getExtraData(pkmnData.species.url);
    console.log("Species Data\n", speciesData);

    //Pokedex Entry 
    console.log("Dex Entry:\n",speciesData.flavor_text_entries[12].flavor_text);

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

test();

//Event listener for pokemon cries (will be assigned to a button soon!)
addEventListener('', function()
{
    cryAudio.src = pkmnData.cries.latest;
    
    //#1 3DS Pikachu Cry Hater. Thank goodness they changed it in Legends and Scarlet/Violet.
    if (pkmnData.id == 25)
        {
            cryAudio.src = pkmnData.cries.legacy;
        } 
        
    cryAudio.volume = 0.2;
    cryAudio.play();
})
