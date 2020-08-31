import {Conversation, UserProfile} from "./model.js";
import {friendSuggestionMap} from "./constants.js";

export const mongodbCleaner = async () => {

    console.log("*** MongoDB clean up script is triggered ***");

    await UserProfile.deleteMany({})
    await Conversation.deleteMany({})
    friendSuggestionMap.clear()

    console.log(`friendSuggestionMap.size = ${friendSuggestionMap.size}`)


    // clean after 15 minutes
    setTimeout(mongodbCleaner, 15 * 60 * 1000);
}