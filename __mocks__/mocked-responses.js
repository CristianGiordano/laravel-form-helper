// TODO: Mock more response types? 503 / 401 / 304 / 201 / 204 ??

export const success = {
    data: [
        {id: 1, name: "Eva"},
        {id: 2, name: "Otto"},
        {id: 3, name: "Loki"}
    ],
};

// TODO: Mock the full response details
export const error = {
    data: {
        foo: ['The foo field is required']
    },
    status: 422,
};
