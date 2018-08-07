import Errors from '../src/ErrorCollection'

test('The errors are empty by default', () => {
    let errors = new Errors();

    expect(errors.items).toEqual({})
});

test('The collection can be constructed with errors', () => {
    let errors = new Errors({
        foo: ['The foo field is required']
    });

    expect(errors.isNotEmpty()).toBe(true)
});

test('Errors can be set', () => {
    let errors = new Errors();
    let expected = {
        foo: ['The foo field is required']
    };

    errors.set(expected);

    expect(errors.items).toStrictEqual(expected)
});

test('Errors cannot be an array when setting the errors', () => {
    let errors = new Errors();

    errors.set('The foo field is required');

    expect(errors.items).not.toEqual('The foo field is required')
});

test('It can check if there are errors', () => {
    let errors = new Errors();

    expect(errors.isEmpty()).toBe(true);
    expect(errors.isNotEmpty()).toBe(false);

    errors.set({
        foo: ['The foo field is required']
    });

    expect(errors.isEmpty()).toBe(false);
    expect(errors.isNotEmpty()).toBe(true);
});

test('Errors can be forgotten', () => {
    let errors = new Errors({
        foo: ['The foo field is required']
    });

    errors.forget();

    expect(errors.isEmpty()).toBe(true);
    expect(errors.items).toStrictEqual({});
});

test('Checking if the errors container', () => {
    let errors = new Errors({
        foo: ['The foo field is required']
    });

    expect(errors.has('foo')).toBe(true);
    expect(errors.has('bar')).toBe(false);
});

test('All errors are returned', () => {
    let expected = {
        foo: ['The foo field is required'],
        bar: ['The bar field is required']
    };
    let errors = new Errors(expected);

    expect(errors.all()).toEqual(expected)
});

test('It can return a single error', () => {
    let errors = new Errors({
        foo: ['The foo field is required'],
        bar: ['The bar field is required']
    });

    expect(errors.get('foo')).toEqual('The foo field is required');
    expect(errors.get('bar')).toEqual('The bar field is required');
});

test('It will not return anything if the error does not exist', () => {
    let errors = new Errors();

    expect(errors.get('bar')).toEqual('');
});