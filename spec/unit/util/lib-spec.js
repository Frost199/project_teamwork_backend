const libUtil = require('../../../util/libs');

describe('Email validation', () => {
  it('should return true if they match', function () {
    const mail = 'test@test.com';
    const isValid = libUtil.isValidEmail(mail);
    expect(isValid).toBeTruthy();
  });

  it('should return false if they match', function () {
    const mail = 'test@test';
    const isValid = libUtil.isValidEmail(mail);
    expect(isValid).toBeFalsy();
  });
});
