import { useState, useEffect } from "react";

const localCache = {};

// The function takes in an animal and calls the breed list from the API. If the animal is changed and then the user returns to the original animal, the breed list is retrieved from cache.
export default function useBreedList(animal) {
  const [breedList, setBreedList] = useState([]);
  // Showing the basic loading states, the status will be used in the next course, Intermediate React
  const [status, setStatus] = useState("unloaded");

  useEffect(() => {
    !animal
      ? setBreedList([])
      : // if the animal has been seen in the localCache...
      localCache[animal] // access to the object property not by ".()" syntax, but from a variable: [animal]
      ? // ...then setBreedList to whatever is in the localCache
        setBreedList(localCache[animal])
      : // otherwise request the list of breeds from the API
        requestBreedList();

    async function requestBreedList() {
      setBreedList([]);
      setStatus("loading");

      const res = await fetch(
        `http://pets-v2.dev-apis.com/breeds?animal=${animal}`
      );
      const json = await res.json();
      // If json.breeds does not exist, set localCache[animal] to an empty array
      localCache[animal] = json.breeds || [];
      setBreedList(localCache[animal]);
      setStatus("loaded");
    }
  }, [animal]);

  return [breedList, status];
}
