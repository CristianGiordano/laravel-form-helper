export default class ErrorCollection {

    constructor(errors = {}) {
        this.items = errors;
    }

    /**
     * Determine if the collection does not contain any errors.
     *
     * @returns {boolean}
     */
    isNotEmpty() {
        return this.isEmpty() === false;
    }

    /**
     * Determine if the collection has any errors.
     *
     * @returns {boolean}
     */
    isEmpty() {
        return Object.getOwnPropertyNames(this.items).length === 0;
    }


    /**
     * Determine if the collection has errors for a given field.
     */
    has(field) {
        return Object.keys(this.items).indexOf(field) > -1;
    }

    /**
     * Get all of the raw errors for the collection.
     */
    all() {
        return this.items;
    }

    /**
     * Get the first error message for a given field.
     */
    get(field) {
        if (this.has(field)) {
            return this.items[field][0];
        }

        return '';
    }

    /**
     * Set the raw errors for the collection.
     */
    set(errors) {
        if (typeof errors === 'object') {
            this.items = errors;
        }
    }

    /**
     * Reset the errors
     */
    forget() {
        this.items = {};
    }
}
