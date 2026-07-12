import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ignoredFile = path.join(__dirname, "../data/ignoredUsers.json");

export class IgnoreService {
    static getIgnoredUsers() {
        if (!fs.existsSync(ignoredFile)) {
            fs.writeFileSync(ignoredFile, "[]");
        }

        try {
            return JSON.parse(fs.readFileSync(ignoredFile, "utf8"));
        } catch {
            return [];
        }
    }

    static saveIgnoredUsers(users) {
        fs.writeFileSync(
            ignoredFile,
            JSON.stringify(users, null, 2)
        );
    }

    static isIgnored(userId) {
        return this.getIgnoredUsers().includes(userId);
    }

    static ignoreUser(userId) {
        const users = this.getIgnoredUsers();

        if (users.includes(userId))
            return false;

        users.push(userId);
        this.saveIgnoredUsers(users);

        return true;
    }

    static unignoreUser(userId) {
        const users = this.getIgnoredUsers();

        if (!users.includes(userId))
            return false;

        this.saveIgnoredUsers(
            users.filter(id => id !== userId)
        );

        return true;
    }
}
