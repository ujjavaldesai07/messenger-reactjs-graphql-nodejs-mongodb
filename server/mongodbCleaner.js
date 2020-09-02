import {friendSuggestionMap} from "./constants.js";
import {db} from "./server.js";

export const mongodbCleaner = async () => {

    console.log("*** MongoDB clean up script is triggered ***");

    await db.collection("userprofiles").deleteMany({})
    await db.collection("conversations").deleteMany({})
    friendSuggestionMap.clear()

    console.log(`friendSuggestionMap.size = ${friendSuggestionMap.size}`)


    // clean after 15 minutes
    setTimeout(mongodbCleaner, 30 * 60 * 1000);
}