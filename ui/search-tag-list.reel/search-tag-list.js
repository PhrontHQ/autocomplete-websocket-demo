/**
 * @module ui/search-tag-list.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class SearchTagList
 * @extends Component
 */
exports.SearchTagList = Component.specialize(/** @lends SearchTagList# */ {

    selectedTag: {
        set: function (value) {
            if (value) {
                this.selectedTags.push(value);
                this.selectedTags = this.selectedTags.slice(0);
            }
        }
    }

});
