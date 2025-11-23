import { asyncHandler } from "../utils/asyncHandler";
import { getProfile, updateProfile, getPublicProfile, searchUserByPhone, searchUserByUniqueId } from "../services/user.service";
export const getMeHandler = asyncHandler(async (req, res) => {
    const user = await getProfile(req.userId);
    res.json({ success: true, data: user });
});
export const updateMeHandler = asyncHandler(async (req, res) => {
    const updated = await updateProfile(req.userId, req.body);
    res.json({ success: true, data: updated });
});
export const getUserByIdHandler = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await getPublicProfile(userId);
    res.json({ success: true, data: user });
});
export const searchUserByUniqueIdHandler = asyncHandler(async (req, res) => {
    const { uniqueId } = req.query;
    const user = await searchUserByUniqueId(uniqueId);
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
});
export const searchUserByPhoneHandler = asyncHandler(async (req, res) => {
    const { phone } = req.query;
    const user = await searchUserByPhone(phone);
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
});
//# sourceMappingURL=user.controller.js.map