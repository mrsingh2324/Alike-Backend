"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModel = void 0;
const mongoose_1 = require("mongoose");
const ContactSchema = new mongoose_1.Schema({
    ownerUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contactUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
ContactSchema.index({ ownerUserId: 1, contactUserId: 1 }, { unique: true });
exports.ContactModel = (0, mongoose_1.model)("Contact", ContactSchema);
//# sourceMappingURL=Contact.js.map