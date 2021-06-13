test('redis host should be defined', () => {
    expect(process.env.REDIS_HOST).toBeDefined();
});

test('redis port should be defined', () => {
    expect(process.env.REDIS_PORT).toBeDefined();
});

test('redis password should be defined', () => {
    expect(process.env.REDIS_PASSWORD).toBeDefined();
});
