function saveToFavs(item)
{
    let itemArray = getFromFavs();
    if (!itemArray.includes(item))
    {
        itemArray.push(item);
    }

    localStorage.setItem('pkmnName', JSON.stringify(itemArray));
    console.log(localStorage);
}

function getFromFavs()
{
    let favsData = localStorage.getItem('pkmnName');

    if (favsData == null)
    {
        return [];
    }

    return JSON.parse(favsData);
}

function removeFromFavs(item)
{
    let favsData = getFromFavs();
    let itemIndex = favsData.indexOf(item);
    favsData.splice(itemIndex, 1);
    localStorage.setItem('pkmnName', JSON.stringify(favsData));
}

export { saveToFavs, getFromFavs, removeFromFavs };