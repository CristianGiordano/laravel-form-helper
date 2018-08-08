import axios from 'axios'
import Errors from './ErrorCollection'

export default class Form {
    constructor(method, url, data = {}) {
        Form.assertMethodIsValid(method)

        this.method = method.toLowerCase()
        this.url = url;
        this.errors = new Errors();
        this.busy = false;
        this.successful = false;

        Object.assign(this, data);
    }

    /**
     * Validate the form method
     *
     * @param method
     */
    static assertMethodIsValid(method) {
        const valid = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

        if (valid.indexOf(method.toUpperCase()) === -1) {
            throw new Error(`Unknown method provided, must be one of the following: ` + valid.join(', '));
        }
    }

    startProcessing() {
        this.busy = true;
        this.successful = false;
    }

    finishProcessing() {
        this.errors.forget();
        this.busy = false;
        this.successful = true;
    }

    finishProcessingWithErrors(errors) {
        this.errors.set(errors);
        this.busy = false;
        this.successful = false;
    }

    hasErrors() {
        return this.errors.isNotEmpty();
    }

    submit() {
        if (this.busy) {
            return console.warn('Double form submission, either debounce or prevent multiple form submissions');
        }

        return new Promise((resolve, reject) => {
            this.startProcessing();
            let payload = this.payload();

            if (this.isGetRequest()) {
                payload = { params: payload }
            }

            return axios[this.method](this.url, payload)
                .then((response) => {
                    this.finishProcessing();

                    resolve(response);
                })
                .catch((error) => {
                    this.finishProcessingWithErrors(error.response.data.errors);

                    reject(error)
                });
        });
    }

    payload() {
        let payload = JSON.parse(JSON.stringify(this))
        let attributes = ['busy', 'successful', 'errors', 'method', 'url']

        attributes.forEach((attribute) => {
            delete payload[attribute]
        });

        return payload;
    }

    isGetRequest() {
        return this.method.toUpperCase() === 'GET';
    }
}