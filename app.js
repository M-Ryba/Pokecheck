const baseURI = "https://pokeapi.co/api/v2/pokemon/";

function toggleDetails(label) {
  const checkbox = label.querySelector(".collapsible-toggle");
  const details = label.nextElementSibling;
  if (checkbox.checked == true) {
    details.style.maxHeight = "100vh";
  } else {
    details.style.maxHeight = "0vh";
  }
}

function showLoader() {
  document.getElementById("pokemon-list").innerHTML =
    '<img id="loading" src="img/loader.gif" alt="" />';
}

function search() {
  const searchInput = document
    .getElementById("search-text")
    .value.toString()
    .toLowerCase()
    .replace(/\s/g, ""); // Remove all whitespaces
  if (searchInput.length !== 0) {
    // Show loading indicator
    showLoader();
    const searchArray = searchInput.split(",");
    loadPokemon(searchArray);
  } else {
    showLoader();
    loadFirstPokemon(20);
  }
}

const getPokemon = async (input) => {
  try {
    // Wait 1 second so that the loader can be seen
    await new Promise((r) => setTimeout(r, 1000));
    // Convert to single item array if given one pokemon
    const pokemonIdentifiers = Array.isArray(input) ? input : [input];
    if (pokemonIdentifiers.length === 0) {
      throw new Error("Invalid input: Provide a Pokemon name/ID");
    }

    // Function to fetch single Pokemon
    const fetchPokemon = async (identifier) => {
      const URI = `${baseURI}${identifier}`;
      const response = await fetch(URI);

      if (!response.ok) {
        document.getElementById("pokemon-list").innerHTML =
          '<p class="error">No Pokémon found!</p>';
        throw new Error(`Failed to fetch Pokemon: ${identifier}`);
      }
      return response.json();
    };

    // Fetch one or multiple Pokemon
    const pokemonData = await Promise.all(pokemonIdentifiers.map(fetchPokemon));

    return pokemonData;
  } catch (error) {
    throw error;
  }
};

// inputArray should be an array of Pokemon IDs or names
function loadPokemon(inputArray) {
  if (inputArray.length >= 1) {
    getPokemon(inputArray)
      .then((pokemonArray) => {
        let pokemonList = "";
        console.log(pokemonArray);
        pokemonArray.forEach((pokemon) => {
          const types = pokemon.types.reduce(
            (acc, curr) => acc + `<li>${curr.type.name}</li>`,
            ""
          );
          pokemonList += `<div class="pokemon-card">
              <span>#${String(pokemon.id).padStart(4, "0")}</span>
              <span>${pokemon.name}</span>
              <img class="pokemon-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                pokemon.id
              }.png" alt="${pokemon.name}" />
              <label class="collapsible-label" onclick="toggleDetails(this)">
                <input class="collapsible-toggle" type="checkbox" />
                Details
              </label>
              <div class="pokemon-details">
                <ul>
                  <li>
                    Types:
                    <ol>
                      ${types}
                    </ol>
                  </li>
                  <li>
                    Stats:
                    <ul>
                      <li>HP: ${pokemon.stats[0].base_stat}</li>
                      <li>Attack: ${pokemon.stats[1].base_stat}</li>
                      <li>Defense: ${pokemon.stats[2].base_stat}</li>
                      <li>Special Attack: ${pokemon.stats[3].base_stat}</li>
                      <li>Special Defense: ${pokemon.stats[4].base_stat}</li>
                      <li>Speed: ${pokemon.stats[5].base_stat}</li>
                    </ul>
                  </li>
                  <li>Height: ${pokemon.height}</li>
                  <li>Weight: ${pokemon.weight}</li>
                </ul>
              </div>
            </div>`;
          document.getElementById("pokemon-list").innerHTML = pokemonList;
        });
      })
      .catch((error) => console.error(error));
  } else {
    console.error("Input error");
  }
}

function loadFirstPokemon(n) {
  const pokemonIdsArray = Array.from({ length: n }, (_, i) => i + 1); // [1...n]
  loadPokemon(pokemonIdsArray);
}
