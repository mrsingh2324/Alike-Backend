"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    uniqueId: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    profilePicUrl: { type: String, default: "" },
    about: { type: String, default: "Hey there! I am using Alike." },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null }
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
//# sourceMappingURL=User.js.map