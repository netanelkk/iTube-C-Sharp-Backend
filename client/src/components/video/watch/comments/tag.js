import { userSearch } from "../../../../api";
/*
    ***
    Tagging class
    ***

    tagMode - Boolean, indicates if user is trying to tag user.
    suggestions - Contains all search result when tagging.
    content - Contains the text input content from user.    
    sugIndex - The selected index of user from suggestions list.
*/
export class Tag {
    constructor() {
        this.tagMode = false;
        this.suggestions = [];
        this.content = "";
        this.sugIndex = 0;
    }

    // Adding selected tag to list
    addTag(username) {
        let withoutTag = this.content.lastIndexOf("@");
        this.content = this.content.slice(0, withoutTag) +
            "<div class='tag' contenteditable='false'>@" + username + "</div>&nbsp;";
        this.tagMode = false;
        this.suggestions = [];
    }

    // Handle suggestion index when user click on keyboard arrows
    keyboardPress(key) {
        switch (key) {
            case "ArrowDown":
                this.sugIndex = (this.sugIndex + 1 < this.suggestions.length) ?
                    this.sugIndex + 1 : this.sugIndex;
                break;
            case "ArrowUp":
                this.sugIndex = (this.sugIndex - 1 >= 0) ?
                    this.sugIndex - 1 : this.sugIndex;
                break;
        }
    }

    // Remove HTML from content
    stripHtml(html) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    // Handling user's input
    handleChange(inputValue) {
        let value = inputValue.replace("&nbsp;", " ").replace("<br>", "");
        let valueSplit = value.split("@");
        let spaceSplit = value.split(' ');

        if (value[value.length - 1] === "@" || spaceSplit[spaceSplit.length - 1][0] === "@")
            this.tagMode = true;
        if (value[value.length - 1] === " " || value.length == 0)
            this.tagMode = false;
        this.content = inputValue.replace("&nbsp;", " ");

        return valueSplit;
    }

    // Fetching suggestions based on input
    async getSuggestions(valueSplit) {
        let content = valueSplit[valueSplit.length - 1];
        const index = (content.indexOf(' ') === -1) ?
            content.length : content.indexOf(' ');
        if (index > 0) {
            const d = await userSearch(content.slice(0, index));
            if (d.pass && this.tagMode) { // tagMode checked again because of await delay
                this.sugIndex = 0;
                this.suggestions = d.Data;
            } else {
                this.suggestions = [];
            }
        }
    }
}