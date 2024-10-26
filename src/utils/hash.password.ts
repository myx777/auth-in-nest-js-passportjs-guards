import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

// Преобразуем scrypt в асинхронную функцию
const scrypt = promisify(_scrypt);

/**
 * Хеширование пароля с уникальной солью
 * @param password - Пароль для хеширования
 * @param saltLength - Длина соли, по умолчанию 16
 * @returns Хешированный пароль в формате "соль:хеш"
 */
export async function hashPassword(password: string, saltLength = 16): Promise<string> {
  const salt = randomBytes(saltLength).toString("hex");

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Проверка пароля
 * @param password - Пароль для проверки
 * @param hash - Хеш в формате "соль:хеш"
 * @returns true, если пароль совпадает
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const [ salt, key ] = hash.split(":");
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

    return key === derivedKey.toString("hex");
}