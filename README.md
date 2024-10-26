# Домашнее задание к занятию «2.6. Аутентификация в NestJS, Passport.js, Guards»

**Правила выполнения домашней работы.**
* Выполняйте домашнее задание в отдельной ветке проекта на GitHub.
* В поле для сдачи работы прикрепите ссылку на ваш проект в Git.
* На проверку можно отправить как все задачи вместе, так и каждую задачу по отдельности. 
* Во время проверки вашей домашней работы по частям будет стоять статус «На доработке».
* Любые вопросы по решению задач можете задавать в чате учебной группы.

**Выполните задания.**

**Задание 1.**

Создать модуль для регистрации (*signup*) и аутентификации (*signin*) пользователей (*AuthModule*).
После аутентификации пользователя необходимо генерировать **JSON Web Token (JWT)** и возвращать его на клиент.
**JWT payload** должен содержать структуру данных:
```javascript
{
  id: "string", // id пользователя
  email: "string", // email пользователя
  firstName: "string" // firstName пользователя
}
``` 

#### Методы
Метод | URL | Действие | Комментарий
--- | --- | ---  | ---
`POST` | `/api/users/signup` | Регистрация пользователей | Для регистрации пользователей необходимо использовать структуру данных: ``{ email: "string", password: "string", firstName: "string", lastName: "string" }``
`POST` | `/api/users/signin` | Аутентификация пользователей | Для аутентификации пользователей необходимо использовать структуру данных: ``{ email: "string", password: "string" }``

*Опционально: зарегистрированные пользователи должны сохраняться в MongoDB*.

**Задание 2.**

Создать собственную стратегию **JWT** с использованием **Passport**. **JWT**-секрет неоходимо хранить в *.env*-файле.

**Задание 3.**

Создать авторизационный **Guard** с использованием реализованной стратегии **JWT**.
Подключить авторизационный **Guard** к контроллерам для авторизации пользовательских запросов.


```
npm install @nestjs/jwt @nestjs/passport passport bcryptjs mongoose
npm install @types/passport-jwt
npm i --save @nestjs/config
```