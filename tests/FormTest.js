import Form from '../src/Form';
import Errors from '../src/ErrorCollection'
import AxiosMock from 'jest-mock-axios';
import {error, success} from '../__mocks__/mocked-responses.js';

afterEach(() => {
    AxiosMock.reset();
});

test('The form is created correctly', () => {
    let form = new Form('GET', '/dogs');

    expect(form.method).toEqual('get');
    expect(form.url).toEqual('/dogs');
    expect(form.busy).toEqual(false);
    expect(form.successful).toEqual(false);
    expect(form.errors).toEqual(new Errors());
});

test('GET requests are allowed', () => {
    expect(() => {
        new Form('GET', '/dogs')
    }).not.toThrow()
});

test('POST requests are allowed', () => {
    expect(() => {
        new Form('POST', '/dogs')
    }).not.toThrow()
});

test('PUT requests are allowed', () => {
    expect(() => {
        new Form('PUT', '/dogs')
    }).not.toThrow()
});

test('PATCH requests are allowed', () => {
    expect(() => {
        new Form('PATCH', '/dogs')
    }).not.toThrow()
});
test('DELETE requests are allowed', () => {
    expect(() => {
        new Form('DELETE', '/dogs')
    }).not.toThrow()
});

test('HEAD requests are allowed', () => {
    expect(() => {
        new Form('HEAD', '/dogs')
    }).not.toThrow()
});

test('OPTIONS requests are allowed', () => {
    expect(() => {
        new Form('OPTIONS', '/dogs')
    }).not.toThrow()
});

test('A non standard HTTP verb throws an error', () => {
    expect(() => {
        new Form('FOO', '/dogs')
    }).toThrow()
})

test('Data can be passed and merged', () => {
    let form = new Form('GET', '/dogs', {foo: 'bar'});

    expect(form.foo).toEqual('bar');
});

test('When the form starts processing', () => {
    let form = new Form('GET', '/dogs');

    form.startProcessing();

    expect(form.busy).toEqual(true);
    expect(form.successful).toEqual(false);
});

test('When the form finished successfully', () => {
    let form = new Form('GET', '/dogs');
    form.startProcessing();

    form.finishProcessing();

    expect(form.busy).toEqual(false);
    expect(form.successful).toEqual(true);
});

test('When the form finishes with errors', () => {
    let form = new Form('GET', '/dogs');
    form.startProcessing();

    form.finishProcessingWithErrors({
        foo: ['The foo field is required']
    });

    expect(form.busy).toEqual(false);
    expect(form.successful).toEqual(false);
    expect(form.hasErrors()).toEqual(true);
});

test('Errors are forgotten when finished processing', () => {
    let form = new Form('GET', '/dogs');
    form.finishProcessingWithErrors({
        foo: ['The foo field is required']
    });

    form.finishProcessing();

    expect(form.busy).toEqual(false);
    expect(form.successful).toEqual(true);
    expect(form.hasErrors()).toEqual(false);
});

test('Will check if there are any errors', () => {
    let form = new Form('GET', '/dogs');

    expect(form.hasErrors()).toBe(false);

    form.errors.set({
        foo: ['The foo field is required']
    });

    expect(form.hasErrors()).toBe(true);
});

test('Test a successful request', () => {
    let form = new Form('GET', '/dogs');

    let actual = form.submit();

    // Assert pre response conditions
    expect(AxiosMock.get).toHaveBeenCalledWith('/dogs', {params: {}});
    expect(actual).toBeInstanceOf(Promise);
    expect(form.busy).toBe(true);
    expect(form.successful).toBe(false);

    // Mock the server responding
    AxiosMock.mockResponse(success);

    // Assert final state
    expect(form.busy).toBe(false);
    expect(form.successful).toBe(true);

    // Assert actual response from the mocked response is passed to the callback
    return actual.then((response) => {
        expect(response.data).toEqual(success.data);
    });
});

test('A failed request', () => {
    let form = new Form('GET', '/dogs');

    let actual = form.submit();

    // Assert pre response conditions
    expect(AxiosMock.get).toHaveBeenCalledWith('/dogs', {params: {}});
    expect(actual).toBeInstanceOf(Promise);
    expect(form.busy).toBe(true);
    expect(form.successful).toBe(false);

    // Mock the server responding
    AxiosMock.mockError(error);

    // Assert final state
    expect(form.busy).toBe(false);
    expect(form.successful).toBe(false);
    expect(form.hasErrors()).toBe(true);

    // Assert actual response from the mocked response is passed to the callback
    return actual.catch((error) => {
        expect(error.data).toEqual(error.data);
    });
});

test('Additional requests on the same form will be prevented', () => {
    let form = new Form('GET', '/dogs');
    let actual = form.submit();
    let warn = global.console.warn;
    global.console.warn = jest.fn();

    // Assert pre response conditions
    expect(AxiosMock.get).toHaveBeenCalledWith('/dogs', {params: {}});
    expect(actual).toBeInstanceOf(Promise);

    actual = form.submit();

    expect(actual).toBeUndefined();
    expect(global.console.warn).toHaveBeenCalled();

    // Restore console
    global.console.warn = warn;
});

test('It will send data with the request', () => {
    let form = new Form('POST', '/dogs', {
        name: 'Eva', breed: 'Northern Inuit', temper: 'Perfect'
    });

    form.submit();

    expect(AxiosMock.post).toHaveBeenCalledWith('/dogs', {
        name: 'Eva', breed: 'Northern Inuit', temper: 'Perfect'
    });
});

test('GET request data is passed as a params property to the config', () => {
    let form = new Form('GET', '/dogs', {
        page: 5, items: 100, sort: 'cuteness'
    });

    form.submit();

    expect(AxiosMock.get).toHaveBeenCalledWith('/dogs', {
        params: {
            page: 5, items: 100, sort: 'cuteness'
        }
    })
});

test('Nest attributes are sent', () => {
    let form = new Form('POST', '/dogs', {
        user: {
            name: 'Phoenix', age: '33'
        }
    });

    form.submit();

    expect(AxiosMock.post).toHaveBeenCalledWith('/dogs', {
        user: {
            name: 'Phoenix', age: '33'
        }
    });
});