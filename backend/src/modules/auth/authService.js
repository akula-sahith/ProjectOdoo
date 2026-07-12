const userRepository = require('../../repositories/userRepository');
const { hashPassword, comparePassword } = require('../../utils/passwordUtils');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwtUtils');

/**
 * Throw a formatted error with a status code.
 */
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Register a new user in the system.
 */
const registerUser = async ({ employee_code, full_name, email, password, role_name = 'EMPLOYEE', department_id }) => {
  // 1. Check if email is already taken
  const existingEmailUser = await userRepository.findByEmail(email);
  if (existingEmailUser) {
    throw createError('A user with this email already exists', 409);
  }

  // 2. Check if employee code is already taken
  const existingCodeUser = await userRepository.findByEmployeeCode(employee_code);
  if (existingCodeUser) {
    throw createError('A user with this employee code already exists', 409);
  }

  // 3. Resolve role ID from role name
  const role = await userRepository.findRoleByName(role_name);
  if (!role) {
    throw createError(`Role '${role_name}' does not exist in the database`, 400);
  }

  // 4. Hash user password
  const passwordHash = await hashPassword(password);

  // 5. Create user in the database
  const newUser = await userRepository.createUser({
    employee_code,
    full_name,
    email,
    password_hash: passwordHash,
    role_id: role.role_id,
    department_id: department_id ? Number(department_id) : null
  });

  // 6. Generate JWT Tokens
  const tokenPayload = {
    user_id: newUser.user_id,
    email: newUser.email,
    role_name: role.role_name
  };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // 7. Format returned user (omit password_hash)
  const { password_hash, ...userResponse } = newUser;

  return {
    user: userResponse,
    tokens: {
      accessToken,
      refreshToken
    }
  };
};

/**
 * Login an existing user.
 */
const loginUser = async ({ email, password }) => {
  // 1. Find user by email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  // 2. Verify account status is active
  if (user.status !== 'ACTIVE') {
    throw createError('Account is inactive. Please contact support.', 401);
  }

  // 3. Verify password match
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw createError('Invalid email or password', 401);
  }

  // 4. Generate JWT Tokens
  const tokenPayload = {
    user_id: user.user_id,
    email: user.email,
    role_name: user.role.role_name
  };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // 5. Format returned user (omit password_hash)
  const { password_hash, ...userResponse } = user;

  return {
    user: userResponse,
    tokens: {
      accessToken,
      refreshToken
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};
