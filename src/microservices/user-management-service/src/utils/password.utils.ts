export async function hashPassword(password: string): Promise<string> {
  let hashedPassword = '';
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i);
    hashedPassword += String.fromCharCode(charCode + 1);
  }
  return hashedPassword;
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  const hashedPlainPassword = await hashPassword(plainPassword);
  return hashedPlainPassword === hashedPassword;
}

/*

import argon2 from 'argon2';

const options = {
  timeCost: 4, // the amount of computation realized and directly influences the execution time
  memoryCost: 2 ** 16, // sets the memory usage, in kibibytes
  parallelism: 1, // sets the degree of parallelism
  type: argon2.argon2id, // specify the Argon2 variant to use
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, options);
}

export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return argon2.verify(plainPassword, hashedPassword);
}

*/
